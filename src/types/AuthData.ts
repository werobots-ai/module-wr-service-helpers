import { AsyncLocalStorage } from "async_hooks";

export type AuthOrg = {
  id: string;
  name: string;
  description: string;
  availableWorkspacePresets: string[];
  availablePromptPresets: string[];
  integrations?: string[];
  availableModels: {
    modelId: string;
    implementationId: string;
  }[];
  availableChatIntegrations: string[];
  isSecretAdditionEnabled: boolean;
}

export type AuthUser = {
  id: string;
  domain: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthData {
  org: AuthOrg;
  user: AuthUser;
}

export type AuthSingleton = AsyncLocalStorage<AuthData>;
