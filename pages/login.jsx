import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";

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

export default function Login(props) {
  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 200) return router.push("/dashboard");

      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | CineTrack</title>
        <meta name="description" content="Login to your CineTrack account." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <section className={styles.authSection}>
          <div className={styles.authCard}>
            <p className={styles.heroTag}>Welcome back</p>
            <h1 className={styles.authTitle}>Log in to FilmStack</h1>
            <p className={styles.authText}>
              Access your saved movies, ratings, favorites, and notes.
            </p>

            <form className={styles.authForm} onSubmit={handleLogin}>
              <label htmlFor="username" className={styles.authLabel}>
                Username
              </label>
              <input
                className={styles.authInput}
                type="text"
                name="username"
                id="username"
                onChange={handleChange}
                value={username}
              />

              <label htmlFor="password" className={styles.authLabel}>
                Password
              </label>
              <input
                className={styles.authInput}
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                value={password}
              />

              <button type="submit" className={styles.authButton}>
                Login
              </button>

              {error && <p className={styles.authError}>{error}</p>}
            </form>

            <p className={styles.authSwitch}>
              Need an account?{" "}
              <Link href="/signup" className={styles.inlineLink}>
                Sign up here
              </Link>
            </p>
          </div>
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