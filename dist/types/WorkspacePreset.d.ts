export type WorkspacePreset = {
    name: string;
    label: string;
    description: string;
    allowedFileTypes: string[] | null;
    autoIndex: [
        {
            name: string;
            segmenter: {
                chunkSize: number;
                overlap: number | null;
            } | null;
        }
    ] | null;
    aiParser: {
        documentDescription: string;
        fields: Record<string, {
            description: string;
            precedingReasoning: string | null;
            multiValue: boolean;
        }>;
        rules: string[];
    } | null;
};
