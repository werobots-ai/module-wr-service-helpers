export type WorkspacePreset = {
  name: string;
  label: string;
  description: string;
  allowedFileTypes: string[] | null;
  autoIndex:
    | [
        {
          name: string; // indices are unique by name and workspaceId. 'default-1000', 'default-2000' and 'default-4000' are reserved for legacy azure on-your-data indices
          segmenter: {
            chunkSize: number;
            overlap: number | null;
          } | null;
        }
      ]
    | null;
  aiParser: {
    documentDescription: string;
    fields: Record<
      string,
      | {
          description: string;
          precedingReasoning: string;
          multiValue: false;
          examples: string[];
          reasoningExamples: string[];
        }
      | {
          description: string;
          precedingReasoning: string;
          multiValue: true;
          examples: string[][];
          reasoningExamples: string[];
        }
      | {
          description: string;
          precedingReasoning: null;
          multiValue: false;
          examples: string[];
        }
      | {
          description: string;
          precedingReasoning: null;
          multiValue: true;
          examples: string[][];
        }
    >;
    rules: string[];
  } | null;
};
