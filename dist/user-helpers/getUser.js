import { userSingleton } from "./userSingleton.js";
export const getUser = () => userSingleton.getStore().user;
