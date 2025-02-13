import { AsyncLocalStorage } from "async_hooks";

export type AuthOrg = {
  id: string;
  name: string;
  description: string;
  availableWorkspacePresets: string[];
  availablePromptPresets: string[];
  availableModels: {
    modelId: string;
    implementationId: string;
  }[];
  availableChatIntegrations: string[];
  isSecretAdditionEnabled: boolean;
}

export type AuthUser = {
  name: string;
  domain: string;
  id: string;
  roles: string[];
}

export interface AuthData {
  org: AuthOrg;
  user: AuthUser;
}

export type AuthSingleton = AsyncLocalStorage<AuthData>;
