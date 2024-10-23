import { nullable } from "zod";

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
  dataLanguage?: string;
  label: string;
} & Reasoning;

export type AiParserLeafField = BaseField &
  (
    | ({
        // Leaf fields do not have 'fields' property
        type: "string" | "number" | "date" | "boolean";
        dateFormat?: string; // For date fields
        nullable?: false;
        searchable: boolean;
        filterable: boolean;
      } & (
        | { multiValue: false; examples: string[] | number[] } // Single value examples
        | { multiValue: true; examples: string[][] | number[][] }
      ))
    | ({
        // Leaf fields do not have 'fields' property
        type: "string" | "number" | "date" | "boolean";
        dateFormat?: string; // For date fields
        nullable: true;
        searchable: boolean;
        filterable: boolean;
      } & (
        | { multiValue: false; examples: (string | null)[] | (number | null)[] } // Single value examples
        | {
            multiValue: true;
            examples: (string | null)[][] | (number | null)[][];
          }
      ))
  ); // Multi value examples

export type AiParserNestedField = BaseField & {
  // Nested fields have 'fields' property
  fields: Record<string, AiParserField>;

  // For nested fields a list of subfields to join and display when collapsed. array of strings with min 1 element
  subFieldsInLabel: string[];
  subFieldsReducer?:
    | {
        method: "flatten";
      }
    | {
        method: "join";
        separator: string | string[];
      };
  multiValue: boolean;
} & (
    | {
        excludeFromRag: true;
      }
    | {
        subFieldsInRag: string[];
      }
  );

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

type ProcessScreenshotPositiveValues =
  | "color"
  | "grayscale"
  | "color+grayscale";
type ProcessScreenshotValues =
  | ProcessScreenshotPositiveValues
  | false
  | null
  | undefined
  | "";

export type AiParserProcessConfig =
  | {
      processExtractedText: true;
      processOcrText?: boolean;
      processPageScreenshots?: ProcessScreenshotValues;
    }
  | {
      processExtractedText?: boolean;
      processOcrText?: true;
      processPageScreenshots?: ProcessScreenshotValues;
    }
  | {
      processExtractedText?: false;
      processOcrText?: false;
      processPageScreenshots: ProcessScreenshotPositiveValues;
    };

export type AiParserConfig = {
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
};
