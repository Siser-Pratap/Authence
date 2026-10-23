import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="welcome">
        <p className={styles.brand}>Authence</p>
        <h1 id="welcome">A simpler way to sign in.</h1>
        <p>Account access is temporarily unavailable while we upgrade Authence.</p>
      </section>
    </main>
  );
}
