/// <reference types="node" resolution-mode="require"/>
import { AsyncLocalStorage } from "async_hooks";
import { AuthData } from "../types/AuthData.js";
export declare const userSingleton: AsyncLocalStorage<AuthData>;
