import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="welcome">
        <p className={styles.brand}>Authence</p>
        <h1 id="welcome">Your account.<br />Your space.</h1>
        <p>Create an account and make yourself at home.</p>
        <nav className={styles.actions} aria-label="Account access">
          <Link className={styles.primary} href="/sign-up">Create account</Link>
          <Link href="/sign-in">Sign in <span aria-hidden="true">→</span></Link>
        </nav>
      </section>
    </main>
  );
}
