// TODO: maybe initialize dotenv here

export const requireEnv: <T extends string>(keys: T[]) => Record<T, string> = (
  variableNames
) =>
  variableNames.reduce((acc, name) => {
    if (!process.env[name]) {
      throw new Error(`${name} is not set in env`);
    }

    acc[name] = process.env[name] as string;
    return acc;
  }, {} as Record<string, string>);
