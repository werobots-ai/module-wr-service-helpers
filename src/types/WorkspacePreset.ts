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
  provider: string;
  modelName: string;
  vectorDimension: number;
};

export type SegmenterConfig = {
  strategy: string;
  maxLength: number;
  minOverlap: number;
  maxOverlap: number;
  keepParagraphs: boolean;
};

export type AutoIndexConfig = {
  name: string; // Indices are unique by name and workspaceId.
  segmenter: SegmenterConfig | null;
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
