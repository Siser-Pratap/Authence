"use client";

import styles from "@/components/auth/auth.module.css";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className={styles.page}><section className={styles.panel}>
    <h1>Something went wrong</h1><p className={styles.description}>Please try again in a moment.</p>
    <button className={styles.button} type="button" onClick={reset}>Try again</button>
  </section></main>;
}
