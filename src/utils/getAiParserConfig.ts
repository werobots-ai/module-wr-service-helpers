import { AiParserConfig, AutoIndexConfig } from "../types/WorkspacePreset";

export const getAiParserConfig = ({
  autoIndexConfig,
  workspaceAiParserConfig,
  skipKeyChecks,
}: {
  autoIndexConfig: AutoIndexConfig;
  workspaceAiParserConfig?: AiParserConfig | null;
  skipKeyChecks?: boolean;
}): AiParserConfig | null => {
  const aiParserConfig = {
    ...(workspaceAiParserConfig &&
    autoIndexConfig.useWorkspaceAiDocumentParserOutput
      ? workspaceAiParserConfig
      : {}),
    ...(("aiParserConfig" in autoIndexConfig &&
      autoIndexConfig.aiParserConfig) ||
      {}),
    ...autoIndexConfig.segmenters.reduce(
      (acc, segmenter) => ({
        ...acc,
        ...(("aiChunkParser" in segmenter && segmenter.aiChunkParser) || {}),
      }),
      {}
    ),
  } as AiParserConfig;

  if (skipKeyChecks) {
    return aiParserConfig;
  }

  if (
    "documentDescription" in aiParserConfig &&
    aiParserConfig.documentDescription &&
    "fields" in aiParserConfig &&
    aiParserConfig.fields &&
    "rules" in aiParserConfig &&
    aiParserConfig.rules
  ) {
    return aiParserConfig;
  }

  return null;
};
