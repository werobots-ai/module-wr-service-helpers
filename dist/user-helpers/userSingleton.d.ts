/// <reference types="node" resolution-mode="require"/>
import { AsyncLocalStorage } from "async_hooks";
import { User } from "../types/User.js";
export declare const userSingleton: AsyncLocalStorage<{
    user: User;
}>;
