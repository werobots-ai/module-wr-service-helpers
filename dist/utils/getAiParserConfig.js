"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiParserConfig = void 0;
const getAiParserConfig = ({ autoIndexConfig, workspaceAiParserConfig, }) => {
    const aiParserConfig = {
        ...(workspaceAiParserConfig &&
            autoIndexConfig.useWorkspaceAiDocumentParserOutput
            ? workspaceAiParserConfig
            : {}),
        ...(("aiParserConfig" in autoIndexConfig &&
            autoIndexConfig.aiParserConfig) ||
            {}),
        ...autoIndexConfig.segmenters.reduce((acc, segmenter) => ({
            ...acc,
            ...(("aiChunkParser" in segmenter && segmenter.aiChunkParser) || {}),
        }), {}),
    };
    if (aiParserConfig.documentDescription &&
        aiParserConfig.fields &&
        aiParserConfig.rules) {
        return aiParserConfig;
    }
    return null;
};
exports.getAiParserConfig = getAiParserConfig;
