export declare const invokeService: (service: string, path: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "MERGE" | "get" | "post" | "put" | "patch" | "delete" | "merge", data?: string | Record<string, any>, options?: {
    [key: string]: any;
    headers?: Record<string, string | null> | undefined;
    skipJsonParse?: boolean | undefined;
} | undefined) => Promise<any>;
