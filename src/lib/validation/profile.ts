export function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

export function normalizeUsername(value: string) {
  const username = value.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    throw new Error("Use 3–30 letters, numbers, or underscores for your username.");
  }
  return username;
}

export const passwordPolicy = { minLength: 12, maxLength: 128 } as const;
