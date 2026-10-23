import "server-only";
import { MongoClient } from "mongodb";
import { getAuthConfig } from "./env";

type DatabaseConnection = Awaited<ReturnType<typeof connectDatabase>>;
const state = globalThis as typeof globalThis & { authenceDatabase?: Promise<DatabaseConnection> };

async function connectDatabase() {
  const config = getAuthConfig();
  const client = new MongoClient(config.mongodbUri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    timeoutMS: 10000,
    maxPoolSize: 10,
  });
  try {
    await client.connect();
    const db = client.db(config.databaseName);
    await Promise.all([
      db.collection("user").createIndex({ email: 1 }, { unique: true }),
      db.collection("user").createIndex({ name: 1 }, { unique: true }),
      db.collection("account").createIndex({ providerId: 1, accountId: 1 }, { unique: true }),
      db.collection("account").createIndex({ userId: 1 }),
      db.collection("session").createIndex({ token: 1 }, { unique: true }),
      db.collection("session").createIndex({ userId: 1 }),
      db.collection("session").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection("verification").createIndex({ identifier: 1 }),
      db.collection("rateLimit").createIndex({ key: 1 }, { unique: true }),
    ]);
    return { client, db };
  } catch (error) {
    await client.close();
    throw error;
  }
}

export function getDatabase() {
  if (!state.authenceDatabase) {
    state.authenceDatabase = connectDatabase().catch((error: unknown) => {
      state.authenceDatabase = undefined;
      throw error;
    });
  }
  return state.authenceDatabase;
}
