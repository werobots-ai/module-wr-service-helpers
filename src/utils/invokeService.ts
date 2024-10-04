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

  const serviceUrl = process.env[getEnvKeyForService(serviceName)];
  if (!serviceUrl) {
    throw new Error(`No URL found for service: ${serviceName}`);
  }

  console.log(`Loaded URL for service: ${serviceName}: ${serviceUrl}`);
  serviceUrls[serviceName] = serviceUrl;

  return serviceUrl;
};

export const invokeService = async (
  service: string,
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "get" | "post" | "put" | "delete",
  data?: any,
  options?: {
    headers?: Record<string, string>;
    skipJsonParse?: boolean;
    [key: string]: any;
  }
) => {
  // streaming not yet supported. it simply fetches the data from the service
  // and returns it as a JSON object
  // handles errors and status codes
  try {
    const url = getServiceUrl(service) + path;

    const rawResponse = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options, // allow overriding the headers and other fetch options
    });

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

    return await rawResponse.json();
  } catch (error: any) {
    throw new Error(
      `Error while invoking service ${service}: ${error.message}`
    );
  }
};
