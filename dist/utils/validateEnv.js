export const validateEnv = (variableNames) => {
    variableNames.forEach((name) => {
        if (!process.env[name]) {
            throw new Error(`${name} is not set`);
        }
    });
};
