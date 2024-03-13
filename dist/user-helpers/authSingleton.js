import { AsyncLocalStorage } from "async_hooks";
export const authSingleton = new AsyncLocalStorage();
