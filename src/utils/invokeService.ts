// this will dynamically load serviceNames from from env as needed.
const serviceUrls = {} as Record<string, string>;

const getEnvKeyForService = (serviceName: string) => {
  // converts to uppercase and replaces spaces and dashes with underscores
  // also removes "service-wr-" from the start of the string
  return `${serviceName
    .toUpperCase()
    .replace(/[\s-]/g, "_")
    .replace(/^SERVICE_WR_/, "")}_API_URL`;
};

const getServiceUrl = (serviceName: string) => {
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

const removeNullHeaders = (
  headers: Record<string, string | null>
): Record<string, string> =>
  Object.keys(headers)
    .filter((k) => headers[k] !== null)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: headers[key],
      }),
      {}
    );

export const invokeService = async (
  service: string,
  path: string,
  method:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "MERGE"
    | "get"
    | "post"
    | "put"
    | "patch"
    | "delete"
    | "merge",
  data?: string | Record<string, any>,
  options?: {
    headers?: Record<string, string | null>;
    skipJsonParse?: boolean;
    [key: string]: any;
  }
) => {
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
      throw new Error(
        `Error ${status} while invoking service ${service} at ${url}: ${error}`
      );
    }

    if (options?.skipJsonParse) {
      return rawResponse;
    }

    const text = await rawResponse.text();
    try {
      return JSON.parse(text);
    } catch (error: any) {
      return text;
    }
  } catch (error: any) {
    throw new Error(
      `Error while invoking service ${service}: ${error.message} ${
        error.cause?.code
      } ${JSON.stringify(
        {
          error,
          service,
          path,
          method,
        },
        null,
        2
      )} `
    );
  }
};
