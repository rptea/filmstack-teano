import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";

export default function Header(props) {
  const logout = useLogout();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.brand}>
          FilmStack
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
          Home
        </Link>

        <Link href="/search" className={styles.navLink}>
          Search
        </Link>

        {props.isLoggedIn && (
          <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
        )}
        </nav>
      </div>

      <div className={styles.right}>
        {props.isLoggedIn ? (
          <>
            <span className={styles.welcome}>
              Welcome, {props.username}!
            </span>
            
            <button
              type="button"
              className={styles.logoutButton}
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}