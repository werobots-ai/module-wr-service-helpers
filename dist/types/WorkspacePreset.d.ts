type Field = {
    description: string;
    filterable: boolean;
    searchable: boolean;
} & ({
    multiValue: false;
    examples: string[];
} | {
    multiValue: true;
    examples: string[][];
}) & ({
    precedingReasoning: string;
    reasoningExamples: string[];
} | {
    precedingReasoning: null;
});
export type AutoIndexConfig = {
    name: string;
    segmenter: {
        chunkSize: number;
        overlap: number;
    } | null;
};
export type AiParserConfig = {
    documentDescription: string;
    fields: Record<string, Field>;
    rules: string[];
};
export type WorkspacePreset = {
    name: string;
    label: string;
    description: string;
    allowedFileTypes: string[] | null;
    autoIndex: AutoIndexConfig[] | null;
    aiParser: AiParserConfig | null;
};
export {};
