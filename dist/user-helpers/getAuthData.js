import { userSingleton } from "./userSingleton.js";
export const getAuthData = () => userSingleton.getStore().user;
