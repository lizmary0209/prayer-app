import "./Header.css";

export default function Header({ onOpenLogin, onOpenAddPrayer }) {
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
          <button className="btn btn--ghost" type="button" onClick={onOpenLogin}>
            Sign In
          </button>
          <button className="btn btn--primary" type="button" onClick={onOpenAddPrayer}>
            New Prayer
          </button>
        </nav>
      </div>
    </header>
  );
}
