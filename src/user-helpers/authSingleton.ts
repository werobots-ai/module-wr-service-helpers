import { AsyncLocalStorage } from "async_hooks";
import { AuthData } from "../types/AuthData.js";

export const authSingleton = new AsyncLocalStorage<AuthData>();
