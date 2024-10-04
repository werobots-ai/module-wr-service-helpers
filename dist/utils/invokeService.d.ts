export declare const invokeService: (service: string, path: string, method: "GET" | "POST" | "PUT" | "DELETE" | "get" | "post" | "put" | "delete", data?: any, options?: {
    [key: string]: any;
    headers?: Record<string, string> | undefined;
    skipJsonParse?: boolean | undefined;
} | undefined) => Promise<any>;
