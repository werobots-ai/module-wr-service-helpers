export declare const invokeService: (service: string, path: string, method: "GET" | "POST" | "PUT" | "DELETE" | "get" | "post" | "put" | "delete", data?: any, options?: {
    [key: string]: any;
    headers?: HeadersInit | undefined;
    skipJsonParse?: boolean | undefined;
} | undefined) => Promise<any>;
