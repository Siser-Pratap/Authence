import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  return (
    <>
      <h1>Sign in</h1>
      <p className={styles.description}>Welcome back. Make yourself at home.</p>
      {registered === "1" ? <p className={styles.notice} role="status">If your details can be registered, you can now sign in. Existing accounts keep their current password.</p> : null}
      <AuthForm mode="sign-in" />
      <p className={styles.footer}>New to Authence? <Link href="/sign-up">Create an account</Link></p>
    </>
  );
}
