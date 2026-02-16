import { useEffect, useState } from "react";
import { request } from "../../utils/api";
import "./Cards.css";

function Cards({ onPrayForCard, onOpenAuth }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verseState, setVerseState] = useState({});

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError("");

   
        const data = await request("/api/prayers");
        setCards(data.prayers || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const toggleVerse = async (card) => {
    const prayerId = card._id;
    const ref = card.scripture;
    if (!ref) return;

    const current = verseState[prayerId] || {};
    const nextIsOpen = !current.isOpen;


    setVerseState((prev) => ({
      ...prev,
      [prayerId]: {
        ...current,
        isOpen: nextIsOpen,
        error: "",
      },
    }));


    const shouldFetch = nextIsOpen && !current.text;
    if (!shouldFetch) return;

    try {
      setVerseState((prev) => ({
        ...prev,
        [prayerId]: { ...(prev[prayerId] || {}), loading: true, error: "" },
      }));

      const data = await request(`/api/scripture?ref=${encodeURIComponent(ref)}`);

      setVerseState((prev) => ({
        ...prev,
        [prayerId]: {
          ...(prev[prayerId] || {}),
          loading: false,
          text: data.text || "",
          reference: data.reference || ref,
          translation: data.translation || "",
        },
      }));
    } catch (err) {
      setVerseState((prev) => ({
        ...prev,
        [prayerId]: {
          ...(prev[prayerId] || {}),
          loading: false,
          error: err.message || "Could not load verse",
        },
      }));
    }
  };

  const handleLike = async (prayerId) => {
    try {
      if (!prayerId) return;


      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Please log in to like a prayer.");
        return;
      }


      const data = await request(`/api/prayers/${prayerId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCards((prev) => prev.map((p) => (p._id === prayerId ? data.prayer : p)));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not like prayer");
    }
  };

  const handlePray = async (prayerId) => {
    try {
      if (!prayerId) return;


      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Please log in to pray on this.");
        return;
      }

      const data = await request(`/api/prayers/${prayerId}/pray`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCards((prev) => prev.map((p) => (p._id === prayerId ? data.prayer : p)));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not update prayer count");
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
          const ref = card.scripture;
          const v = verseState[card._id] || {};
          const verseBtnLabel = v.isOpen ? "Hide Verse" : "View Verse";
          const likesCount = card.likes?.length || 0;
          const prayedCount = card.prayedCount || 0;

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

              {card.description && (
                <p className="cards__msg">{card.description}</p>
              )}

              <div className="cards__actions">
                <button
                  className="cards__btn"
                  type="button"
                  onClick={() => handleLike(card._id)}
                >
                  Like
                </button>

                <button
                  className="cards__btn cards__btn--pray"
                  type="button"
                  onClick={() => handlePray(card._id)}
                >
                  Pray on this
                </button>

                <span className="cards__likes">
                 {likesCount} like{likesCount === 1 ? "" : "s"} •{" "}
                 {prayedCount} prayer{prayedCount === 1 ? "" : "s"}
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
