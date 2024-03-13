/// <reference types="node" resolution-mode="require"/>
import { AsyncLocalStorage } from "async_hooks";
export interface AuthData {
    org: {
        id: string;
        name: string;
        description: string;
    };
    user: {
        name: string;
        domain: string;
    };
}
export type AuthSingleton = AsyncLocalStorage<AuthData>;
