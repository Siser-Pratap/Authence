"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./auth.module.css";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function signOut() {
    setPending(true);
    setError(false);
    try {
      const result = await authClient.signOut();
      if (result.error) { setError(true); return; }
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button className={styles.button} onClick={signOut} disabled={pending} type="button">
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error ? <p className={styles.error} role="alert">We could not sign you out. Please try again.</p> : null}
    </div>
  );
}
