import { Link } from "react-router-dom";
import "./Header.css";
import prayerHands from "../../assets/prayerhands.png";

export default function Header({
  isLoggedIn,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenAddPrayer,
  onOpenSalvation,
  onLogout,
}) {
  const avatarSrc =
    currentUser?.profilePic?.trim() ||
    "https://ui-avatars.com/api/?name=User&background=EEE&color=555&size=64";

  const displayName = currentUser?.displayName || "Profile";

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="brand">
          <div className="brand__mark" aria-hidden="true">
            <img src={prayerHands} alt="Selah logo" className="brand__icon" />
          </div>

          <div className="brand__text">
            <div className="brand__nameRow">
              <div className="brand__name">Selah</div>
              <span className="brand__dot" aria-hidden="true">
                -
              </span>
              <div className="brand__sub">Because your prayers matter.</div>
            </div>
          </div>
        </Link>

        <nav className="header__nav" aria-label="Primary navigation">
          <Link className="header__link" to="/">
            Home
          </Link>
          <Link className="header__link" to="/cards">
            Prayer Wall
          </Link>
          {isLoggedIn && (
            <Link className="header__link header__link--profile" to="/profile">
              <img
                className="header__avatar"
                src={avatarSrc}
                alt={`${displayName} avatar`}
                referrerPolicy="no-referrer"
              />
              Profile
            </Link>
          )}
        </nav>

        <nav className="header__actions" aria-label="Account actions">
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
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn--primary"
                type="button"
                onClick={onOpenAddPrayer}
              >
                Add Prayer
              </button>

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onOpenSalvation}
              >
                Salvation Prayer
              </button>

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onLogout}
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
