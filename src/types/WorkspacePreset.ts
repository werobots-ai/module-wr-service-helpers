type Field = {
  description: string;
  filterable: boolean;
} & (
  | { multiValue: false; examples: string[] }
  | { multiValue: true; examples: string[][] }
) &
  (
    | { precedingReasoning: string; reasoningExamples: string[] }
    | { precedingReasoning: null }
  );

export type AutoIndexConfig = {
  name: string; // indices are unique by name and workspaceId. 'default-1000', 'default-2000' and 'default-4000' are reserved for legacy azure on-your-data indices
  segmenter: {
    chunkSize: number;
    overlap: number | null;
  };
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
