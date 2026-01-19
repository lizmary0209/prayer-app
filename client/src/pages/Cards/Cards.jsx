import { useEffect, useState } from "react";
import "./Cards.css";

function Cards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("http://localhost:5000/api/cards");
                if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status}`);

                const data = await res.json();
                setCards(data.cards || []);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    return (
        <main className="cards">
            <h1 className="cards__title">Encouragement Cards</h1>

            {loading && <p>Loading cards...</p>}
            {error && <p className="cards__error">{error}</p>}

            {!loading && !error && cards.length === 0 && <p>No cards yet.</p>}

            <ul className="cards__list">
                {cards.map((card) => (
                    <li className="cards__item" key={card._id}>
                        <h3 className="cards__item-title">{card.title}</h3>
                        <p className="cards__ref">{card.reference || card.scripture}</p>
                        {card.message && <p className="cards__msg">{card.message}</p>}
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Cards;