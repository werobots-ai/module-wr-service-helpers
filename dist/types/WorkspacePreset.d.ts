type Reasoning = {
    precedingReasoning: string;
    reasoningExamples: string[];
} | {
    precedingReasoning?: null;
};
type BaseField = {
    description: string;
    dataLanguage?: string;
    label: string;
} & Reasoning;
export type AiParserLeafField = BaseField & (({
    type: "string" | "number" | "date" | "boolean";
    dateFormat?: string;
    searchable: boolean;
    filterable: boolean;
} & ({
    multiValue: false;
    examples: string[] | number[];
} | {
    multiValue: true;
    examples: string[][] | number[][];
})) | ({
    type: "string" | "number" | "date" | "boolean";
    dateFormat?: string;
    searchable: boolean;
    filterable: boolean;
} & ({
    multiValue: false;
    examples: (string | null)[] | (number | null)[];
} | {
    multiValue: true;
    examples: (string | null)[][] | (number | null)[][];
})));
export type AiParserNestedField = BaseField & {
    fields: Record<string, AiParserField>;
    subFieldsInLabel: string[];
    subFieldsReducer?: {
        method: "flatten";
    } | {
        method: "join";
        separator: string | string[];
    };
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
type ProcessScreenshotPositiveValues = "color" | "grayscale" | "color+grayscale";
type ProcessScreenshotValues = ProcessScreenshotPositiveValues | false | null | undefined | "";
export type AiParserProcessConfig = {
    processExtractedText: true;
    processOcrText?: boolean;
    processPageScreenshots?: ProcessScreenshotValues;
} | {
    processExtractedText?: boolean;
    processOcrText?: true;
    processPageScreenshots?: ProcessScreenshotValues;
} | {
    processExtractedText?: false;
    processOcrText?: false;
    processPageScreenshots: ProcessScreenshotPositiveValues;
};
export type ModelConfig = {
    provider: "openai";
    modelName: string;
    maxTokens: number;
    temperature: number;
    topP: number;
};
export type AiParserConfig = {
    modelConfig: ModelConfig;
    documentDescription: string;
    dataLanguage?: string;
    fields: Record<string, AiParserField>;
    rules: string[];
} & AiParserProcessConfig;
export type WorkspacePreset = {
    name: string;
    label: string;
    description: string;
    allowedFileTypes: string[] | null;
    autoIndex: AutoIndexConfig[] | null;
    aiDocumentParser: AiParserConfig | null;
    hasFileStorage: boolean;
    allowParsedInput: boolean;
};
export {};
