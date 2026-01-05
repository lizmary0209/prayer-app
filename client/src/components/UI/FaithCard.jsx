import "./FaithCard.css";

export default function FaithCard({ title, hint, verse }) {
  return (
    <article className="faithCard">
      <div className="faithCard__front">
        <div className="faithCard__title">{title}</div>
        <div className="faithCard__hint">{hint}</div>
      </div>

      <div className="faithCard__back" aria-label="Scripture">
        <div className="faithCard__label">Scripture</div>
        <div className="faithCard__verse">{verse}</div>
      </div>
    </article>
  );
}
