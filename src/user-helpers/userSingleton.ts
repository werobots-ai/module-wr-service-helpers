import { AsyncLocalStorage } from "async_hooks";
import { User } from "../types/User.js";

export const userSingleton = new AsyncLocalStorage<{ user: User }>();
