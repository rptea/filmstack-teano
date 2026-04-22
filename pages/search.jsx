import Head from "next/head";
import { useState } from "react";
import Header from "../components/header";
import SearchBar from "../components/search-bar";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Search(props) {
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(query) {
  setLoading(true);
  setError("");
  setSearched(true);

  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("API returned HTML instead of JSON.");
    }

    if (!res.ok) {
      throw new Error(data.error || "Search failed.");
    }

    setResults(data.results || []);
  } catch (err) {
    setError(err.message || "Something went wrong.");
    setResults([]);
  } finally {
    setLoading(false);
  }
}
  async function handleSaveMovie(movie) {
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save movie.");
      }

      alert("Movie saved!");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Search | Filmstack</title>
        <meta name="description" content="Search for movies on Filmstack." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={props?.isLoggedIn} username={props?.user?.username} />

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <p className={styles.heroTag}>Movie search</p>
          <h1 className={styles.heroTitle}>Find movies to add to your tracker</h1>
          <p className={styles.heroText}>
            Search for a title and browse movie results.
          </p>
        </section>

        <div className={styles.searchActions}>
          <Link href="/dashboard" className={styles.secondaryButton}>
            Got to Dashboard
          </Link>
        </div>
        <SearchBar onSearch={handleSearch} />

        {loading && <p className={styles.authText}>Searching...</p>}
        {error && <p className={styles.authError}>{error}</p>}

        {searched && !loading && results.length === 0 && !error && (
          <p className={styles.authText}>No movies found.</p>
        )}

        <section className={styles.infoGrid}>
          {results.map((movie) => (
            <article key={movie.id} className={styles.infoCard}>
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`$movie.title} poster`}
                  className={styles.searchPoster}
                />
              ) : (
                <div className={styles.posterFallback}>No Poster</div>
              )}
              
              <h2>{movie.title}</h2>

              <p className={styles.movieMeta}>
                {movie.release_date || "No release date"}
              </p>
              <p>
                {movie.overview
                  ? movie.overview.slice(0, 160) + "..."
                  : "No overview available."}
              </p>

              <button
                type="button"
                className={styles.saveButton}
                onClick={() => handleSaveMovie(movie)}
              >
                Save Movie
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}