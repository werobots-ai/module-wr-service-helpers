// TODO: maybe initialize dotenv here
export const requireEnv = (variableNames) => variableNames.reduce((acc, name) => {
    if (!process.env[name]) {
        throw new Error(`${name} is not set in env`);
    }
    acc[name] = process.env[name];
    return acc;
}, {});
