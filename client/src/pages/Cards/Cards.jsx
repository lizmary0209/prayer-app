import { useEffect, useState } from "react";
import "./Cards.css";

function Cards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verseState, setVerseState] = useState({});

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

  const toggleVerse = async (card) => {
    const cardId = card._id;
    const ref = card.reference || card.scripture;
    if (!ref) return;

    let shouldFetch = false;

    setVerseState((prev) => {
      const current = prev[cardId] || {};
      const nextIsOpen = !current.isOpen;
      shouldFetch = nextIsOpen && !current.text;

      return {
        ...prev,
        [cardId]: {
          ...current,
          isOpen: nextIsOpen,
          error: "",
        },
      };
    });

    if (!shouldFetch) return;

    try {
      setVerseState((prev) => ({
        ...prev,
        [cardId]: { ...(prev[cardId] || {}), loading: true, error: "" },
      }));

      const res = await fetch(
        `http://localhost:5000/api/scripture?ref=${encodeURIComponent(ref)}`
      );
      if (!res.ok) throw new Error(`Failed to fetch verse: ${res.status}`);

      const data = await res.json();

      setVerseState((prev) => ({
        ...prev,
        [cardId]: {
          ...(prev[cardId] || {}),
          loading: false,
          text: data.text || "",
          reference: data.reference || ref,
          translation: data.translation || "",
        },
      }));
    } catch (err) {
      setVerseState((prev) => ({
        ...prev,
        [cardId]: {
          ...(prev[cardId] || {}),
          loading: false,
          error: err.message || "Could not load verse",
        },
      }));
    }
  };

  const handleLike = async (cardId) => {
    try {
        const token = localStorage.getItem("jwt");

        if (!token) {
            alert("Please log in to like a card (token not found).");
            return;
        }

        const res = await fetch(`http://localhost:5000/api/cards/${cardId}/like`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error(`Like failed: ${res.status}`);

        const data = await res.json();

        setCards((prev) => prev.map((c) => (c._id === cardId ? data.card : c)));
    } catch (err) {
        console.error(err);
        alert(err.message || "Could not like card");
    }
  };

  return (
    <main className="cards">
      <h1 className="cards__title">Encouragement Cards</h1>

      {loading && <p>Loading cards...</p>}
      {error && <p className="cards__error">{error}</p>}

      {!loading && !error && cards.length === 0 && <p>No cards yet.</p>}

      <ul className="cards__list">
        {cards.map((card) => {
          const ref = card.reference || card.scripture;
          const v = verseState[card._id] || {};
          const verseBtnLabel = v.isOpen ? "Hide Verse" : "View Verse";
          const likesCount = card.likes?.length || 0;

          return (
            <li className="cards__item" key={card._id}>
              <div className="cards__top">
                <div>
                  <h3 className="cards__item-title">{card.title}</h3>
                  <p className="cards__ref">{ref}</p>
                </div>

                <button
                  className="cards__btn"
                  type="button"
                  onClick={() => toggleVerse(card)}
                  disabled={!ref}
                >
                  {verseBtnLabel}
                </button>
              </div>

              {card.message && <p className="cards__msg">{card.message}</p>}

              <div className="cards__actions">
                <button
                className="cards__btn"
                type="button"
                onClick={() => handleLike(card._id)}
                >
                    Like
                </button>

                <span className="cards__likes">
                    {likesCount} like{likesCount === 1 ? "" : "s" }
                </span>
              </div>

              {v.isOpen && (
                <div className="cards__verse">
                  {v.loading && <p className="cards__muted">Loading verse...</p>}
                  {v.error && <p className="cards__error">{v.error}</p>}

                  {!v.loading && !v.error && v.text && (
                    <>
                      <p className="cards__verse-text">{v.text}</p>
                      <p className="cards__muted">
                        {v.reference}
                        {v.translation ? ` • ${v.translation}` : ""}
                      </p>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default Cards;
