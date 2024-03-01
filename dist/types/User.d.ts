/// <reference types="node" resolution-mode="require"/>
import { AsyncLocalStorage } from "async_hooks";
export interface User {
    id: string;
    name: string;
    description: string;
}
export type UserSingleton = AsyncLocalStorage<{
    user: User;
}>;
