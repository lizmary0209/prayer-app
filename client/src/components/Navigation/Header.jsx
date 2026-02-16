import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({
  isLoggedIn,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenAddPrayer,
  onLogout,
}) {
  const avatarSrc =
  currentUser?.profilePic?.trim() ||
  "https://ui-avatars.com/api/?name=User&background=EEE&color=555&size=64";

  const displayName = currentUser?.displayName || "Profile";


  return (
    <header className="header">
      <div className="header__inner">
        <div className="brand">
          <div className="brand__mark" aria-hidden="true">
            ✦
          </div>
          <div className="brand__text">
            <div className="brand__title">Prayer App</div>
            <div className="brand__sub">Simple. Warm. Faith-centered.</div>
          </div>
        </div>

        <nav className="header__actions">
          {!isLoggedIn ? (
            <>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={onOpenLogin}
              >
                Sign In
              </button>

              <button
                className="btn btn--primary"
                type="button"
                onClick={onOpenRegister}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn--primary"
                type="button"
                onClick={onOpenAddPrayer}
              >
                New Prayer
              </button>

              <div className="header__profile">
                <img
                className="header__avatar"
                src={avatarSrc}
                alt={`${displayName} avatar`}
                referrerPolicy="no-referrer"
                />
                <Link className="header__profileLink" to="/profile">
                {displayName}
                </Link>
              </div>
              

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
