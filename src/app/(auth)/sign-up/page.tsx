import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <>
      <h1>Create your account</h1>
      <p className={styles.description}>Choose your details to get started.</p>
      <AuthForm mode="sign-up" />
      <p className={styles.footer}>Already have an account? <Link href="/sign-in">Sign in</Link></p>
    </>
  );
}
