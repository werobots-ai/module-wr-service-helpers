export declare const invokeService: (service: string, path: string, method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "MERGE" | "get" | "post" | "put" | "patch" | "delete" | "merge", data?: string | Record<string, any>, options?: {
    headers?: Record<string, string | null>;
    skipJsonParse?: boolean;
    [key: string]: any;
}) => Promise<any>;
