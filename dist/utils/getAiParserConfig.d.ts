import { AiParserConfig, AutoIndexConfig } from "../types/WorkspacePreset";
export declare const getAiParserConfig: ({ autoIndexConfig, workspaceAiParserConfig, }: {
    autoIndexConfig: AutoIndexConfig;
    workspaceAiParserConfig?: AiParserConfig | null | undefined;
}) => AiParserConfig | null;
