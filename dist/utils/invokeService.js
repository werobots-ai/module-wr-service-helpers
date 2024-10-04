"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeService = void 0;
// this will dynamically load serviceNames from from env as needed.
const serviceUrls = {};
const getEnvKeyForService = (serviceName) => {
    // converts to uppercase and replaces spaces and dashes with underscores
    // also removes "service-wr-" from the start of the string
    return `${serviceName
        .toUpperCase()
        .replace(/[\s-]/g, "_")
        .replace(/^SERVICE_WR_/, "")}_API_URL`;
};
const getServiceUrl = (serviceName) => {
    if (serviceUrls[serviceName]) {
        return serviceUrls[serviceName];
    }
    const envKey = getEnvKeyForService(serviceName);
    console.log(`Loading URL for service: ${serviceName} from env: ${envKey}`);
    const serviceUrl = process.env[envKey];
    if (!serviceUrl) {
        console.warn(`

        ==========================================================
        WARNING: No URL found for service: ${serviceName}
        You need to set the environment variable ${envKey}
        ==========================================================

    `);
        throw new Error(`No URL found for service: ${serviceName}`);
    }
    console.log(`Loaded URL for service: ${serviceName}: ${serviceUrl}`);
    serviceUrls[serviceName] = serviceUrl;
    return serviceUrl;
};
const removeNullHeaders = (headers) => Object.keys(headers)
    .filter((k) => headers[k] !== null)
    .reduce((acc, key) => ({
    ...acc,
    [key]: headers[key],
}), {});
const invokeService = async (service, path, method, data, options) => {
    try {
        const url = getServiceUrl(service) + path;
        const fetchOptions = {
            method: method.toUpperCase(),
            ...(data
                ? { body: typeof data === "object" ? JSON.stringify(data) : data }
                : {}),
            ...(options || {}),
            headers: {
                ...(options?.headers ? removeNullHeaders(options.headers) : {}),
                ...(data && typeof data === "object"
                    ? { "Content-Type": "application/json" }
                    : {}),
            },
        };
        const rawResponse = await fetch(url, fetchOptions);
        if (!rawResponse.ok) {
            const status = rawResponse.status;
            const error = await rawResponse.text();
            throw new Error(`Error ${status} while invoking service ${service} at ${url}: ${error}`);
        }
        if (options?.skipJsonParse) {
            return rawResponse;
        }
        return await rawResponse.json();
    }
    catch (error) {
        throw new Error(`Error while invoking service ${service}: ${error.message}`);
    }
};
exports.invokeService = invokeService;
