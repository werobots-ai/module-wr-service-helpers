type Reasoning =
  | {
      precedingReasoning: string;
      reasoningExamples: string[];
    }
  | {
      precedingReasoning?: null;
    };

type BaseField = {
  name: string;
  description: string;
} & Reasoning;

type LeafField = BaseField & {
  // Leaf fields do not have 'fields' property
  type: "string" | "number" | "date" | "boolean";
  dateFormat?: string; // For date fields
  searchable: boolean;
} & (
    | // For filterable fields
    {
        filterable: true;
        label: string; // Label is required when filterable is true
      }
    // For non-filterable fields
    | {
        filterable: false;
        label?: string;
      }
  ) &
  (
    | { multiValue: false; examples: string[] } // Single value examples
    | { multiValue: true; examples: string[][] }
  );
type NestedField = BaseField & {
  // Nested fields have 'fields' property
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
  name: string; // Indices are unique by name and workspaceId.
  segmenter: {
    chunkSize: number;
    overlap: number;
  } | null;
  embedder: EmbedderConfig | null; // Moved from WorkspacePreset
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
