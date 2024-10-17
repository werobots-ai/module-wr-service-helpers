import { AiParserConfig, AutoIndexConfig } from "../types/WorkspacePreset";

export const getAiParserConfig = ({
  autoIndexConfig,
  workspaceAiParserConfig,
}: {
  autoIndexConfig: AutoIndexConfig;
  workspaceAiParserConfig?: AiParserConfig | null;
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

  if (
    aiParserConfig.documentDescription &&
    aiParserConfig.fields &&
    aiParserConfig.rules
  ) {
    return aiParserConfig;
  }

  return null;
};
