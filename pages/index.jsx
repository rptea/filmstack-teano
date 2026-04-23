import Head from "next/head";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function Home(props) {
  const logout = useLogout();

  return (
    <div className={styles.container}>
      <Head>
        <title>FilmStack</title>
        <meta
          name="description"
          content="Track movies, save favorites, rate films, and write personal notes."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <p className={styles.heroTag}>Your movie library</p>

          <h1 className={styles.heroTitle}>
            Save, rate, and keep notes all in one place.
          </h1>

          <p className={styles.heroText}>
            FilmStack gives you a simple way to track what to watch next, organize what you've seen, and build a personal movie collection :)
          </p>

          <div className={styles.heroActions}>
            {props.isLoggedIn ? (
              <>
                <Link href="/dashboard" className={styles.primaryButton}>
                  Open My Library
                </Link>

                <Link href="/dashboard" className={styles.secondaryButton}>
                  Search Movies
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className={styles.primaryButton}>
                  Create Account
                </Link>

                <Link href="/login" className={styles.secondaryButton}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </section>

        <section className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <h2>Save movies</h2>
            <p>Keep track of movies you want to watch, have watched, or already own.</p>
          </article>

          <article className={styles.infoCard}>
            <h2>Rate favorites</h2>
            <p>Give each movie your own rating and quickly filter your favorites.</p>
          </article>

          <article className={styles.infoCard}>
            <h2>Add notes</h2>
            <p>Write short thoughts and reviews so your dashboard feels personal.</p>
          </article>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerBrand}>FilmStack</p>
          <p className={styles.footerText}>
            Track movies, save favorites, rate films, and write notes.
          </p>
        </div>
      </footer>
    </div>
  );
}