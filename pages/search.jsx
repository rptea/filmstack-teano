import Head from "next/head";
import { useState } from "react";
import Header from "../components/header";
import SearchBar from "../components/search-bar";
import homeStyles from "../styles/Home.module.css";
import searchStyles from "../styles/Search.module.css";
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
    <div className={homeStyles.container}>
      <Head>
        <title>Search | Filmstack</title>
        <meta name="description" content="Search for movies on Filmstack." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header 
        isLoggedIn={props?.isLoggedIn} 
        username={props?.user?.username} 
      />
      <main className={homeStyles.main}>
        <section className={homeStyles.heroSection}>
          <p className={homeStyles.heroTag}>Movie search</p>
          <h1 className={homeStyles.heroTitle}>Find movies to add to your Library.</h1>
          <p className={homeStyles.heroText}>
            Search for a title, browse movie results, and save movies to FilmStack.
          </p>
        </section>

          <div className={searchStyles.searchActions}>
            <Link 
              href="/dashboard" 
              className={homeStyles.secondaryButton}
            >
              Go to My Library
            </Link>
          </div>

          <SearchBar onSearch={handleSearch} />

          {loading && <p 
            className={homeStyles.authText}>Searching...</p>}
          {error && <p 
            className={homeStyles.authError}>{error}</p>}

          {searched && !loading && results.length === 0 && !error && (
            <p className={homeStyles.authText}>No movies found.</p>
          )}

          {results.length > 0 && (
            <div className={searchStyles.resultsHeader}>
              <p className={searchStyles.resultsCount}>
                {results.length} result{results.length === 1 ? "" : "s"} found
              </p>
            </div>
          )}

          <section className={searchStyles.infoGrid}>
            {results.map((movie) => (
              <article 
                key={movie.id} 
                className={searchStyles.infoCard}>
                {movie.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className={searchStyles.searchPoster}
                  />
                ) : (
                  <div className={searchStyles.posterFallback}>No Poster</div>
                )}
                
                <h2>{movie.title}</h2>

                <p className={homeStyles.movieMeta}>
                  {movie.release_date || "No release date"}
                </p>

                <p>
                  {movie.overview
                    ? movie.overview.slice(0, 160) + "..."
                    : "No overview available."}
                </p>

                <button
                  type="button"
                  className={searchStyles.saveButton}
                  onClick={() => handleSaveMovie(movie)}
                >
                  Save to Library
                </button>
              </article>
          ))}
        </section>
      </main>

      <footer className={homeStyles.footer}>
        <div className={homeStyles.footerContent}>
          <p className={homeStyles.footerBrand}>FilmStack</p>
          <p className={homeStyles.footerText}>
            Track movies, save favorites, rate films, and write notes.
          </p>
        </div>
      </footer>
    </div>
  );
}