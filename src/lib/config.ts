type Environment = Record<string, string | undefined>;

export type AuthConfig = Readonly<{
  mongodbUri: string;
  databaseName: string;
  authSecret: string;
  authOrigin: string;
}>;

// Pure validation lives separately from the server-only environment reader.
export function parseAuthConfig(env: Environment): AuthConfig {
  const required = ["MONGODB_URI", "MONGODB_DB_NAME", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"] as const;
  const missing = required.filter((key) => !env[key]?.trim());
  if (missing.length) throw new Error(`Missing server configuration: ${missing.join(", ")}`);

  const mongodbUri = env.MONGODB_URI!.trim();
  const databaseName = env.MONGODB_DB_NAME!.trim();
  const authSecret = env.BETTER_AUTH_SECRET!;
  const authOrigin = env.BETTER_AUTH_URL!.trim();

  // Error messages name fields only; never include supplied values or causes.
  try {
    const uri = new URL(mongodbUri);
    if (!["mongodb:", "mongodb+srv:"].includes(uri.protocol) || !uri.hostname) throw new Error();
  } catch {
    throw new Error("Invalid MONGODB_URI");
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(databaseName)) throw new Error("Invalid MONGODB_DB_NAME");
  if (authSecret.trim().length < 32) throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters");
  try {
    const url = new URL(authOrigin);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const secure = url.protocol === "https:";
    if ((!secure && !(url.protocol === "http:" && local && env.NODE_ENV !== "production"))
      || url.username || url.password || url.search || url.hash
      || url.pathname !== "/") throw new Error();
    return Object.freeze({ mongodbUri, databaseName, authSecret, authOrigin: url.origin });
  } catch {
    throw new Error("BETTER_AUTH_URL must be an HTTPS origin (local HTTP is allowed outside production)");
  }
}
