"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { normalizeEmail, normalizeUsername, passwordPolicy } from "@/lib/validation/profile";
import styles from "./auth.module.css";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const signingUp = mode === "sign-up";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setError("");
    let email: string;
    let username = "";
    const password = String(form.get("password") || "");
    try {
      email = normalizeEmail(String(form.get("email") || ""));
      if (signingUp) {
        username = normalizeUsername(String(form.get("username") || ""));
        if (password !== form.get("confirmation")) {
          setError("Your passwords do not match.");
          return;
        }
      }
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : "Check your details.");
      return;
    }
    setPending(true);
    try {
      const result = signingUp
        ? await authClient.signUp.email({ email, password, name: username })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : signingUp
            ? "We could not create your account. Check your details or try signing in."
            : "We could not sign you in. Check your email and password and try again.");
        return;
      }
      router.replace(signingUp ? "/sign-in?registered=1" : "/dashboard");
      router.refresh();
    } catch {
      setError("We could not reach Authence. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} aria-busy={pending}>
      <fieldset className={styles.fields} disabled={pending}>
        <legend className="sr-only">{signingUp ? "Create account details" : "Sign-in details"}</legend>
        {signingUp ? (
          <div className={styles.field}><label htmlFor="username">Username</label>
            <input className={styles.input} id="username" name="username" autoComplete="username" required minLength={3} maxLength={30} aria-describedby="username-hint" />
            <span className={styles.hint} id="username-hint">3–30 letters, numbers, or underscores.</span>
          </div>
        ) : null}
        <label className={styles.field} htmlFor="email">Email
          <input className={styles.input} id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <div className={styles.field}><label htmlFor="password">Password</label>
          <input className={styles.input} id="password" name="password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} required minLength={signingUp ? passwordPolicy.minLength : 1} maxLength={passwordPolicy.maxLength} aria-describedby={signingUp ? "password-hint" : undefined} />
          {signingUp ? <span className={styles.hint} id="password-hint">Use 12–128 characters.</span> : null}
        </div>
        {signingUp ? (
          <label className={styles.field} htmlFor="confirmation">Confirm password
            <input className={styles.input} id="confirmation" name="confirmation" type="password" autoComplete="new-password" required maxLength={passwordPolicy.maxLength} />
          </label>
        ) : null}
      </fieldset>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button className={styles.button + " " + styles.formButton} disabled={pending} type="submit">
        {pending ? "Please wait…" : signingUp ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
