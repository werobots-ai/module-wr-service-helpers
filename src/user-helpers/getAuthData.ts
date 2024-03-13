import { authSingleton } from "./authSingleton.js";

export const getAuthData = () => authSingleton.getStore();
