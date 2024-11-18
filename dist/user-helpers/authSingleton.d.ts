import { AsyncLocalStorage } from "async_hooks";
import { AuthData } from "../types/AuthData.js";
export declare const authSingleton: AsyncLocalStorage<AuthData>;
