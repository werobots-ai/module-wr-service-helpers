type Reasoning = {
    precedingReasoning: string;
    reasoningExamples: string[];
} | {
    precedingReasoning: null;
};
type BaseField = {
    name: string;
    description: string;
} & Reasoning;
type LeafField = BaseField & {
    type: "string" | "number" | "date" | "boolean";
    dateFormat?: string;
    searchable: boolean;
} & (// For filterable fields
{
    filterable: true;
    label: string;
} | {
    filterable: false;
    label?: string;
}) & ({
    multiValue: false;
    examples: string[];
} | {
    multiValue: true;
    examples: string[][];
});
type NestedField = BaseField & {
    fields: Record<string, Field>;
    multiValue: boolean;
};
export type Field = LeafField | NestedField;
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
