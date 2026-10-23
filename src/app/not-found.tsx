import Link from "next/link";
import styles from "@/components/auth/auth.module.css";

export default function NotFound() {
  return <main className={styles.page}><section className={styles.panel}>
    <h1>Page not found</h1><p className={styles.description}>The page you are looking for is unavailable.</p>
    <Link href="/">Return to Authence</Link>
  </section></main>;
}
