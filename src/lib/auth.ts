import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { getDatabase } from "./db";
import { getAuthConfig } from "./env";
import { normalizeEmail, normalizeUsername, passwordPolicy } from "./validation/profile";

async function createAuth() {
  const config = getAuthConfig();
  const { db, client } = await getDatabase();
  return betterAuth({
    appName: "Authence",
    baseURL: config.authOrigin,
    secret: config.authSecret,
    trustedOrigins: [config.authOrigin],
    database: mongodbAdapter(db, { client }),
    logger: { disabled: true },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      minPasswordLength: passwordPolicy.minLength,
      maxPasswordLength: passwordPolicy.maxLength,
      revokeSessionsOnPasswordReset: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-up/email": { window: 60, max: 5 },
        "/sign-in/email": { window: 60, max: 5 },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            try {
              return { data: { ...user, email: normalizeEmail(user.email), name: normalizeUsername(user.name) } };
            } catch {
              throw new APIError("BAD_REQUEST", { message: "Invalid registration details." });
            }
          },
        },
        update: {
          before: async (user) => {
            try {
              return { data: {
                ...user,
                ...(user.name !== undefined ? { name: normalizeUsername(user.name) } : {}),
                ...(user.email !== undefined ? { email: normalizeEmail(user.email) } : {}),
              } };
            } catch {
              throw new APIError("BAD_REQUEST", { message: "Invalid profile details." });
            }
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  if (!auth) {
    auth = createAuth().catch((error: unknown) => {
      auth = undefined;
      throw error;
    });
  }
  return auth;
}
