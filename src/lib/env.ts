import "server-only";
import { parseAuthConfig } from "./config";

// Deliberately lazy: importing application code must not require a live database or secrets at build time.
export function getAuthConfig() {
  return parseAuthConfig(process.env);
}
