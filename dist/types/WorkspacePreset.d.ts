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
    examples: (string | null)[] | (number | null)[] | (boolean | null)[];
} | {
    multiValue: true;
    examples: (string | null)[][] | (number | null)[][] | (boolean | null)[][];
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
export type FieldSource = {
    sourceField: string;
} | {
    value: string | number | boolean | null | undefined;
} | {
    method: "currentDateTime";
    format?: string;
} | {
    method: "json" | "jsonAsMarkdown";
    mappings?: FieldMappingRule[];
} | {
    method: "concat";
    parts: FieldSource[];
} | {
    method: "delete";
} | {
    method: "flattenObject";
    keys: string[];
    separator?: string;
};
export type FieldMappingRule = FieldSource & {
    targetField: string;
};
export type JsonInputConfig = ({
    asJsonFile: true;
    asJsonPayload?: false;
} | {
    asJsonFile: boolean;
    asJsonPayload: true;
    filenameSource: FieldSource;
    savePayloadAsJsonFile: boolean;
}) & {
    parsers: {
        targetIndexName: string;
        mappings?: FieldMappingRule[];
        generateEmbeddingsFrom?: FieldSource;
    }[];
};
export type WorkspacePreset = {
    name: string;
    label: string;
    description: string;
    entityType: string;
    allowedFileTypes: string[] | null;
    autoIndex: AutoIndexConfig[] | null;
    aiDocumentParser: AiParserConfig | null;
    hasFileStorage: boolean;
    requestMetaFieldsOnCreate?: {
        name: string;
        label: string;
        type: "string" | "number" | "date" | "boolean" | "password";
    }[];
    allowJsonInput?: JsonInputConfig;
};
export {};
