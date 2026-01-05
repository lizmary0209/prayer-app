import "./Prayer.css";

export default function PrayerCard({ prayer, delayMs = 0 }) {
  return (
    <article className="prayerCard" style={{ animationDelay: `${delayMs}ms` }}>
      <div className="prayerCard__top">
        <span className="badge">{prayer.tag}</span>
        <span className="muted">{prayer.createdAt}</span>
      </div>

      <h3 className="prayerCard__title">{prayer.title}</h3>
      <p className="prayerCard__body">{prayer.body}</p>

      <div className="prayerCard__actions">
        <button className="btn btn--ghost" type="button">
          Details
        </button>
        <button className="btn" type="button">
          🙏 Amen
        </button>
      </div>
    </article>
  );
}
