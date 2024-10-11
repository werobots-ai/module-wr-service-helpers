type Reasoning = {
    precedingReasoning: string;
    reasoningExamples: string[];
} | {
    precedingReasoning?: null;
};
type BaseField = {
    description: string;
    label: string;
} & Reasoning;
export type AiParserLeafField = BaseField & {
    type: "string" | "number" | "date" | "boolean";
    dateFormat?: string;
    searchable: boolean;
    filterable: boolean;
} & ({
    multiValue: false;
    examples: string[];
} | {
    multiValue: true;
    examples: string[][];
});
export type AiParserNestedField = BaseField & {
    fields: Record<string, AiParserField>;
    subFieldsInLabel: string[];
    multiValue: boolean;
};
export type AiParserField = AiParserLeafField | AiParserNestedField;
export type EmbedderConfig = {
    provider: string;
    modelName: string;
    vectorDimension: number;
};
export type AutoIndexConfig = {
    name: string;
    segmenter: {
        chunkSize: number;
        overlap: number;
    } | null;
    embedder: EmbedderConfig | null;
};
export type AiParserConfig = {
    documentDescription: string;
    fields: Record<string, AiParserField>;
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
