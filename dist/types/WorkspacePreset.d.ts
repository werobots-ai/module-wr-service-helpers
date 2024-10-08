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
            precedingReasoning: string;
            multiValue: false;
            examples: string[];
            reasoningExamples: string[];
        } | {
            description: string;
            precedingReasoning: string;
            multiValue: true;
            examples: string[][];
            reasoningExamples: string[];
        } | {
            description: string;
            precedingReasoning: null;
            multiValue: false;
            examples: string[];
        } | {
            description: string;
            precedingReasoning: null;
            multiValue: true;
            examples: string[][];
        }>;
        rules: string[];
    } | null;
};
