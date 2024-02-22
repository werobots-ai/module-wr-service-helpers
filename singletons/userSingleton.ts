import { AsyncLocalStorage } from "async_hooks";
import { User } from "../types/User";

export const userSingleton = new AsyncLocalStorage<{ user: User }>();
