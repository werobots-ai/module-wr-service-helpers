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
    name: string;
    provider: string;
    modelName: string;
    vectorDimension: number;
    maxLength: number;
};
export type SegmenterConfig = {
    name: string;
    strategy: string;
    minLength: number;
    maxLength: number;
    minOverlap: number;
    maxOverlap: number;
    useAiDocumentParserOutput: true;
} | {
    name: string;
    strategy: string;
    minLength: number;
    maxLength: number;
    minOverlap: number;
    maxOverlap: number;
    useAiDocumentParserOutput: false;
    aiChunkParser: AiParserConfig | null;
};
export type AutoIndexConfig = {
    name: string;
    segmenters: SegmenterConfig[];
    embedders: EmbedderConfig[];
    useWorkspaceAiDocumentParserOutput: true;
} | {
    name: string;
    segmenters: SegmenterConfig[];
    embedders: EmbedderConfig[];
    useWorkspaceAiDocumentParserOutput: false;
    aiDocumentParser: AiParserConfig | null;
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
    aiDocumentParser: AiParserConfig | null;
};
export {};
