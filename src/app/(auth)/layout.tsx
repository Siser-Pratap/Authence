import type { ReactNode } from "react";
import Link from "next/link";
import styles from "@/components/auth/auth.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <Link className={styles.brand} href="/">Authence</Link>
        {children}
      </section>
    </main>
  );
}
