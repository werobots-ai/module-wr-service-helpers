import { userSingleton } from "../singletons/userSingleton.js";
export const getUser = () => userSingleton.getStore().user;
