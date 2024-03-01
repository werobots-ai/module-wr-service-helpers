export const validateEnv = (variableNames: string[]) => {
  variableNames.forEach((name) => {
    if (!process.env[name]) {
      throw new Error(`${name} is not set`);
    }
  });
};
