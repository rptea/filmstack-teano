import { useState } from "react";
import styles from "../styles/Search.module.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      setError("Please enter a movie title.");
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while searching.");
      }

      setMovies(data.results || []);
    } catch (err) {
      setError(err.message || "Unable to search movies right now.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Search Movies</h1>
        <p className={styles.description}>
          Search for movies and save them to your tracker.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="movie-search" className={styles.label}>
            Movie title
          </label>

          <div className={styles.searchRow}>
            <input
              id="movie-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title..."
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Search
            </button>
          </div>
        </form>

        {loading && <p className={styles.message}>Loading results...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && movies.length > 0 && (
          <section className={styles.results}>
            <h2 className={styles.resultsTitle}>Results</h2>

            <div className={styles.grid}>
              {movies.map((movie) => (
                <article key={movie.id} className={styles.card}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className={styles.poster}
                    />
                  ) : (
                    <div className={styles.noPoster}>No poster available</div>
                  )}

                  <div className={styles.cardContent}>
                    <h3 className={styles.movieTitle}>{movie.title}</h3>

                    <p className={styles.releaseDate}>
                      {movie.release_date || "Release date unavailable"}
                    </p>

                    <p className={styles.overview}>
                      {movie.overview
                        ? `${movie.overview.slice(0, 140)}${
                            movie.overview.length > 140 ? "..." : ""
                          }`
                        : "No description available."}
                    </p>

                    <button className={styles.saveButton}>Save Movie</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && !error && query && movies.length === 0 && (
          <p className={styles.message}>No movies found.</p>
        )}
      </div>
    </main>
  );
}