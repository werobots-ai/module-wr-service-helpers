type Reasoning =
  | {
      precedingReasoning: string;
      reasoningExamples: string[];
    }
  | {
      precedingReasoning?: null;
    };

type BaseField = {
  description: string;
  label: string;
} & Reasoning;

export type AiParserLeafField = BaseField & {
  // Leaf fields do not have 'fields' property
  type: "string" | "number" | "date" | "boolean";
  dateFormat?: string; // For date fields
  searchable: boolean;
  filterable: boolean;
} & (
    | { multiValue: false; examples: string[] } // Single value examples
    | { multiValue: true; examples: string[][] }
  );

export type AiParserNestedField = BaseField & {
  // Nested fields have 'fields' property
  fields: Record<string, AiParserField>;

  // For nested fields a list of subfields to join and display when collapsed. array of strings with min 1 element
  subFieldsInLabel: string[];
  multiValue: boolean;
};

export type AiParserField = AiParserLeafField | AiParserNestedField;

export type EmbedderConfig = {
  name: string; // Unique within the index, so we can search for differently embedded versions of the same text.
  provider: string;
  modelName: string;
  vectorDimension: number;
  maxLength: number;
};

export type SegmenterConfig =
  | {
      name: string; // Unique within the index, so we can search for differently segmented versions of the same text.
      strategy: string;
      minLength: number;
      maxLength: number;
      minOverlap: number;
      maxOverlap: number;
      useAiDocumentParserOutput: true;
    }
  | {
      name: string; // Unique within the index, so we can search for differently segmented versions of the same text.
      strategy: string;
      minLength: number;
      maxLength: number;
      minOverlap: number;
      maxOverlap: number;
      useAiDocumentParserOutput: false;
      aiChunkParser: AiParserConfig | null;
    };

export type AutoIndexConfig =
  | {
      name: string; // Indices are unique by name and workspaceId.
      segmenters: SegmenterConfig[];
      embedders: EmbedderConfig[];
      useWorkspaceAiDocumentParserOutput: true;
    }
  | {
      name: string; // Indices are unique by name and workspaceId.
      segmenters: SegmenterConfig[];
      embedders: EmbedderConfig[];
      useWorkspaceAiDocumentParserOutput: false;
      aiDocumentParser: AiParserConfig | null;
    };

export type AiParserProcessConfig =
  | {
      processExtractedText: true;
      processPageScreenshots?: null | false | undefined | "";
    }
  | {
      processExtractedText: false;
      processPageScreenshots: "color" | "grayscale" | "color+grayscale";
    }
  | {
      processExtractedText: true;
      processPageScreenshots: "color" | "grayscale" | "color+grayscale";
    };

export type AiParserConfig = {
  documentDescription: string;
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
};
