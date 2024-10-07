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
      {
        description: string;
        precedingReasoning: string | null;
        multiValue: boolean;
      }
    >;
    rules: string[];
  } | null;
};
