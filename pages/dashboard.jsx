import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import { useEffect, useState } from "react";

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

export default function Dashboard(props) {
  const router = useRouter();
  const logout = useLogout();

  const [savedMovies, setSavedMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [moviesError, setMoviesError] = useState("");
  const [movieFilter, setMovieFilter] = useState("all");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchSavedMovies() {
      try {
        setLoadingMovies(true);
        setMoviesError("");

        const response = await fetch("/api/movies");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load saved movies.");
        }

        setSavedMovies(data || []);
      } catch (error) {
        setMoviesError(
          error.message || "Unable to load movies right now."
        );
      } finally {
        setLoadingMovies(false);
      }
    }

    fetchSavedMovies();
  }, []);

  async function handleStatusChange(movieId, newStatus) {
    try {
      const response = await fetch (`/api/movies/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status.');
      }

      setSavedMovies((prev) =>
        prev.map((movie) =>
          movie._id === movieId ? { ...movie, status: newStatus } : movie )
      );
    } catch (error) {
      alert(error.message || 'Unable to update status right now.')
    }
  }

  async function handleFavoriteToggle(movieId, currentFavorite) {
  try {
    const response = await fetch(`/api/movies/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: !currentFavorite }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update favorite.');
    }

    setSavedMovies((prev) =>
      prev.map((movie) =>
        movie._id === movieId
          ? { ...movie, favorite: !currentFavorite }
          : movie
      )
    );
  } catch (error) {
    alert(error.message || 'Unable to update favorite right now.');
  }
} 
  async function handleDeleteMovie(movieId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch (`/api/movies/${movieId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete movie");
      }

      setSavedMovies((prev) =>
        prev.filter((movie) => movie._id !== movieId)
      );
    } catch (error) {
      alert(error.message || "Unable to delete movie right now.");
    }
  }
  
  const filteredMovies =
    movieFilter === "favorites"
      ? savedMovies.filter((movie) => movie.favorite)
      : savedMovies;
  
  async function handleRatingChange(movieId, newRating) {
    try {
      const response = await fetch (`/api/movies/${movieId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: Number(newRating) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update rating.");
      }

      setSavedMovies((prev) =>
        prev.map((movie) =>
          movie._id === movieId
            ? { ...movie, rating: Number(newRating) }
            : movie
          )
        );
    } catch (error) {
      alert(error.message || "Unable to update rating right now.");
    }
  }

    async function handleNotesChange(movieId, newNotes) {
      try {
        const response = await fetch(`/api/movies/${movieId}`, {
          method: "PATCH",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ notes: newNotes }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to updated notes.");
        }

        setSavedMovies((prev) =>
          prev.map((movie) =>
            movie._id === movieId ? { ...movie, notes: newNotes } : movie 
          )
        );
      } catch (error) {
        alert(error.message || "Unable to update notes right now.");
      }
    }

  function openMovieModal(movie) {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }

  function closeMovieModal() {
    setSelectedMovie(null);
    setIsModalOpen(false);
  }
    
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header 
        isLoggedIn={props.isLoggedIn} 
        username={props?.user?.username} 
      />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to a <a href="https://nextjs.org">Next.js!</a> Dashboard Page!
        </h1>

        <p className={styles.description}>
          Current Location: <code className={styles.code}>{router.asPath}</code>
          <br />
          Status:{" "}
          <code className={styles.code}>
            {!props.isLoggedIn && " Not"} Logged In
          </code>
        </p>

        <p className={styles.description}>
          This page is only visible if you are logged in.
        </p>

        <div className={styles.grid}>
          <Link href="/" className={styles.card}>
            <h2>Home &rarr;</h2>
            <p>Return to the homepage.</p>
          </Link>
          <div
            onClick={logout}
            style={{ cursor: "pointer" }}
            className={styles.card}
          >
            <h2>Logout &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </div>
        </div>

        {/* movies section */}
        <section className={ styles.movieSection}>
          <h2 className={styles.title}>My Saved Movies</h2>

          {!loadingMovies && !moviesError && savedMovies.length > 0 && (
            <div className={styles.filterBar}>
              <button
                type="button"
                onClick={() => setMovieFilter("all")}
                className={`${styles.filterButton} ${
                  movieFilter === "all" ? styles.activeFilter : ""
                }`}
              >
                All Movies
              </button>

              <button
                type="button"
                onClick={() => setMovieFilter("favorites")}
                className={`${styles.filterButton} ${
                  movieFilter === "favorites" ? styles.activeFilter : ""
                }`}
              >
                Favorites
              </button>
            </div>
          )}

          {loadingMovies && (
            <p className={styles.description}>Loading saved movies...</p>
          )}

          {moviesError && (
            <p className={styles.description}>{moviesError}</p>
          )}

          {!loadingMovies &&
            !moviesError &&
            savedMovies.length === 0 && (
              <p className={styles.description}>
                You have not saved any movies yet.
              </p>
            )}

          {!loadingMovies &&
            !moviesError &&
            savedMovies.length > 0 &&
            filteredMovies.length === 0 && (
              <p className={styles.description}>
                You do not have any favorite movies yet.
              </p>
            )}

          {!loadingMovies &&
            !moviesError &&
            filteredMovies.length > 0 && (
              <div className={styles.grid}>
                {filteredMovies.map((movie) => (
                  <article 
                    key={movie._id}
                    className={styles.card}
                    onClick={() => openMovieModal(movie)}
                    style={{ cursor: "pointer"}}
                  >
                    {movie.posterPath ? (
                      <img
                        className={styles.moviePoster}
                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                        alt={`${movie.title} poster`}
                        width={150}
                        height={225}
                      />
                    ) : (
                      <div className={styles.movieMeta}>No poster available</div>
                    )}

                    <h3 className={styles.movieTitle}>{movie.title}</h3>

                    <p className={styles.movieMeta}>
                      {movie.releaseDate || "Release date unavailable"}</p>

                    <label className={styles.fieldLabel}>
                      Status:
                      <select
                        className={styles.select}
                        value={movie.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(movie._id, e.target.value)
                        }
                      >
                        <option value="want_to_watch">Want to watch</option>
                        <option value="watched">Watched</option>
                        <option value="owned">Owned</option>
                      </select>
                    </label>

                    <label className={styles.fieldLabel}>
                      Rating:
                      <select 
                        className={styles.select}
                        value={movie.rating ?? ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleRatingChange(movie._id, e.target.value)
                        }
                      >
                        <option value="">Not rated</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </label>

                    <div className={styles.actionRow}>
                      <button
                        type="button"
                        className={styles.favoriteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(movie._id, movie.favorite)
                        }}
                      >
                        {movie.favorite ? "Unfavorite" : "Favorite"}
                      </button>

                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMovie(movie._id)
                        }}
                      >
                        Delete Movie
                      </button>
                    </div>

                    <label className={styles.fieldLabel}>
                      Notes:
                      <textarea
                        className={styles.textarea}
                        value={movie.notes ?? ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleNotesChange(movie._id, e.target.value)
                        }
                        rows={3}
                        placeholder="Add your thoughts or a short review..."
                      />
                    </label>

                    <p className={styles.movieOverview}>
                      {movie.overview
                        ? `${movie.overview.slice(0, 120)}${
                            movie.overview.length > 120 ? "..." : ""
                          }`
                        : "No description available."}
                    </p>
                  </article>
                ))}
              </div>
            )}
        </section>

        {isModalOpen && (
          <div
            className={styles.modalOverlay}
            onClick={closeMovieModal}
          >
            <div 
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeMovieModal}
              >
                Close
              </button>

              <h2 className={styles.movieTitle}>{selectedMovie.title}</h2>

              {selectedMovie.posterPath && (
                <img 
                  className={styles.modalPoster}
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.posterPath}`}
                  alt={`${selectedMovie.title} poster`}
                  width={200}
                  height={300}
                  style={{ marginBottom: "1rem" }}
                />
              )}

              <div className={styles.modalText}>
                <p>
                  <strong> Release Date:</strong>{" "}
                  {selectedMovie.releaseDate || "Unavailable"}
                </p>

                <p>
                  <strong>Rating:</strong>{" "}
                  {selectedMovie.rating || "Not rated"}
                </p>

                <p>
                  <strong>Notes:</strong>{" "}
                  {selectedMovie.notes || "No notes added yet."} 
                </p>

                <p>
                  <strong>Overview:</strong>{" "}
                  {selectedMovie.overview || "No description available."}
                </p>
              </div>
            </div>
          </div>
        )}
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
