/// <reference types="node" />
import { AsyncLocalStorage } from "async_hooks";
export interface AuthData {
    org: {
        id: string;
        name: string;
        description: string;
        availableWorkspacePresets: string[];
    };
    user: {
        name: string;
        domain: string;
        id: string;
        roles: "full-api-access"[];
    };
}
export type AuthSingleton = AsyncLocalStorage<AuthData>;
