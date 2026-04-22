import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Header from "../components/header";

export default function Signup(props) {
  const router = useRouter();
  const [
    { username, password, "confirm-password": confirmPassword },
    setForm,
  ] = useState({
    username: "",
    password: "",
    "confirm-password": "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      username,
      password,
      "confirm-password": confirmPassword,
      ...{ [e.target.name]: e.target.value },
    });
  }

  async function handleCreateAccount(e) {
    e.preventDefault();

    if (!username) return setError("Must include username.");
    if (password !== confirmPassword) {
      return setError("Passwords must match.");
    }

    try {
      const res = await fetch("/api/auth/signup", {
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
        <title>Sign Up | FilmStack</title>
        <meta name="description" content="Create a FilmStack account." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props?.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <section className={styles.authSection}>
          <div className={styles.authCard}>
            <p className={styles.heroTag}>Create your account</p>
            <h1 className={styles.authTitle}>Sign up for FilmStack</h1>
            <p className={styles.authText}>
              Start building your watchlist, rating movies, and saving notes.
            </p>

            <form className={styles.authForm} onSubmit={handleCreateAccount}>
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
                autoComplete="username"
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
                autoComplete="new-password"
              />

              <label htmlFor="confirm-password" className={styles.authLabel}>
                Confirm Password
              </label>
              <input
                className={styles.authInput}
                type="password"
                name="confirm-password"
                id="confirm-password"
                onChange={handleChange}
                value={confirmPassword}
                autoComplete="new-password"
              />

              <button type="submit" className={styles.authButton}>
                Create Account
              </button>

              {error && <p className={styles.authError}>{error}</p>}
            </form>

            <p className={styles.authSwitch}>
              Already have an account?{" "}
              <Link href="/login" className={styles.inlineLink}>
                Log in here
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