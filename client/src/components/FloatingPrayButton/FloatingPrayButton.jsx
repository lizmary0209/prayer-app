import "./FloatingPrayButton.css";

export default function FloatingPrayButton({ onClick }) {
    return (
        <button className="floating-pray" type="button" onClick={onClick} aria-label="Add a prayer">
            + Pray
        </button>
    );
}