import { Handler } from 'express';
import jwt from 'jsonwebtoken';

import { AuthData } from '../types/AuthData.js';
import { invokeService } from '../utils/invokeService.js';
import { authSingleton } from './authSingleton.js';

const securityHeaderName =
  process.env.SECURITY_HEADER_NAME || ("x-wr-key" as string);

const CACHE_EXPIRATION = 1000 * 60; // 1 minute
const MAX_CACHE_SIZE_BEFORE_LOGGING = 1000;

type CacheItem = {
  token: string;
  data: AuthData;
  expiresAt: number;
};

// simple in-memory cache. If needed, this can be replaced with a more sophisticated cache like Redis
const cache: Record<string, CacheItem> = {};

const addToCache = (token: string, data: AuthData) => {
  cache[token] = {
    token,
    data,
    expiresAt: Date.now() + CACHE_EXPIRATION,
  };

  const cacheSize = Object.keys(cache).length;
  if (cacheSize <= MAX_CACHE_SIZE_BEFORE_LOGGING) return;

  if (cacheSize > MAX_CACHE_SIZE_BEFORE_LOGGING * 2) {
    console.error(
      `Auth cache size (loggedInMw.ts in module-wr-service-helpers) has exceeded the limit of ${MAX_CACHE_SIZE_BEFORE_LOGGING}. Halving the cache size to prevent memory issues.`
    );

    const keys = Object.keys(cache);
    const half = Math.floor(keys.length / 2);
    for (let i = 0; i < half; i += 1) {
      delete cache[keys[i]];
    }

    return;
  }

  console.warn(
    `Auth cache size (loggedInMw.ts in module-wr-service-helpers) is ${cacheSize} which is greater than ${MAX_CACHE_SIZE_BEFORE_LOGGING} set as the limit. Consider using a more sophisticated cache like Redis.`
  );
};

const getAuthData = async (
  token: string
): Promise<{
  data: AuthData | null;
  error: (Error & { status: number }) | null;
}> => {
  const cached = cache[token];
  if (cached && cached.expiresAt > Date.now()) {
    return { data: cached.data, error: null };
  }

  const userQueryResponse = await invokeService(
    "service-wr-auth",
    "/verify",
    "POST",
    {
      token: token,
    },
    { skipJsonParse: true }
  );

  if (!userQueryResponse.ok) {
    return {
      data: null,
      error: {
        ...new Error(await userQueryResponse.text()),
        status: userQueryResponse.status,
      },
    };
  }

  let data: AuthData;
  try {
    data = await userQueryResponse.json();
  } catch (e) {
    return {
      data: null,
      error: {
        ...new Error("Failed to parse auth data as JSON"),
        status: userQueryResponse.status,
      },
    };
  }

  if (!data) {
    return {
      data: null,
      error: {
        ...new Error("Invalid auth data"),
        status: 500,
      },
    };
  }

  addToCache(token, data);

  return { data, error: null };
};

export const ensureLoggedIn: Handler = async (req, res, next) => {
  try {
    const token = req.headers[securityHeaderName];
    if (!token || typeof token !== "string") {
      res.status(401).send("Unauthorized");
      return;
    }

    if (process.env.AUTH_SECRET) {
      const decodedToken = jwt.decode(token);
      if ((decodedToken as any)?.isServiceToken) {
        const data = jwt.verify(token, process.env.AUTH_SECRET) as AuthData;
        authSingleton.run(data, next);
        console.log("Service token resolved internally");
        return;
      }
    }

    const { data, error } = await getAuthData(token);
    if (error) {
      res
        .status(error.status || 500)
        .send(error.message || "Internal Server Error: Cannot verify user");
      return;
    }

    if (!data) {
      res.status(401).send("Unauthorized");
      return;
    }

    authSingleton.run(data, next);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: Cannot verify user");
  }
};
