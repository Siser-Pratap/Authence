import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = { title: "Your account" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const requestHeaders = await headers();
  let session;
  try {
    const auth = await getAuth();
    session = await auth.api.getSession({ headers: requestHeaders });
  } catch {
    return (
      <main className={styles.dashboard}>
        <h1>Your account is temporarily unavailable.</h1>
        <p>Please try again in a moment.</p>
        <Link href="/dashboard">Try again</Link>
      </main>
    );
  }
  if (!session) redirect("/sign-in");

  return (
    <main className={styles.dashboard}>
      <header>
        <Link className={styles.brand} href="/">Authence</Link>
        <SignOutButton />
      </header>
      <h1>Welcome, {session.user.name}.</h1>
      <p className={styles.description}>This is your space. You are signed in.</p>
      <section className={styles.account} aria-labelledby="account-heading">
        <h2 id="account-heading">Account details</h2>
        <dl>
          <dt>Username</dt><dd>{session.user.name}</dd>
          <dt>Email</dt><dd>{session.user.email}</dd>
        </dl>
      </section>
    </main>
  );
}
