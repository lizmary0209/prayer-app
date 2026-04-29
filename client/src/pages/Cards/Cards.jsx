import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request, getSalvationCount } from "../../utils/api";
import "./Cards.css";

import AddPrayerModal from "../../components/AddPrayerModal/AddPrayerModal";

const COVER_POOLS = {
  forest: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
  ],
  mountains: [
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=60",
  ],
  sunrise: [
    "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1496309732348-3627f3f040ee?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
  ],
  water: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1437482078695-73f5ca6c96d1?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1501084817091-a4f3d1b64c2a?auto=format&fit=crop&w=1200&q=60",
  ],
  fields: [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=60",
  ],
  neutral: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
  ],
};

const CATEGORY_RULES = [
  {
    category: "sunrise",
    keywords: ["hope", "joy", "praise", "grace", "new", "restore", "renew", "morning"],
  },
  {
    category: "water",
    keywords: ["peace", "still", "calm", "rest", "anxiety", "fear", "worry", "storm"],
  },
  {
    category: "mountains",
    keywords: ["strength", "courage", "bold", "battle", "war", "endure", "persevere", "victory"],
  },
  {
    category: "forest",
    keywords: ["healing", "comfort", "guidance", "presence", "refuge", "shadow", "valley"],
  },
  {
    category: "fields",
    keywords: ["provide", "provision", "daily", "bless", "family", "growth", "harvest"],
  },
];

const PRAYER_CATEGORIES = [
  "All Prayers",
  "Healing",
  "Family",
  "Strength",
  "Guidance",
  "Gratitude",
];

function getCoverCategory(card) {
  if (card?.category) return card.category;

  const haystack = `${card?.title || ""} ${card?.scripture || ""} ${
    card?.description || ""
  }`.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => haystack.includes(k))) return rule.category;
  }

  return "neutral";
}

function hashString(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function getNatureImage(card) {
  const category = getCoverCategory(card);
  const pool = COVER_POOLS[category] || COVER_POOLS.neutral;
  const seed = card?._id || card?.title || "selah";
  const idx = hashString(String(seed) + category) % pool.length;

  return pool[idx];
}

function Cards({ currentUser, refreshToken }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verseState, setVerseState] = useState({});
  const [openCardId, setOpenCardId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [salvationCount, setSalvationCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState(
    localStorage.getItem("selahActiveCategory") || "All Prayers"
  );

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
  }, [refreshToken]);

  useEffect(() => {
    const fetchSalvationCount = async () => {
      try {
        const data = await getSalvationCount();
        setSalvationCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch salvation count:", err);
      }
    };

    fetchSalvationCount();
  }, []);

  const getCategoryMatches = (category) => {
    if (category === "All Prayers") return cards;

    const searchTerm = category.toLowerCase();

    return cards.filter((card) => {
      const haystack = `${card.title || ""} ${card.description || ""} ${
        card.scripture || ""
      } ${card.category || ""}`.toLowerCase();

      return haystack.includes(searchTerm);
    });
  };

  const filteredCards = getCategoryMatches(activeCategory);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    localStorage.setItem("selahActiveCategory", category);
    setOpenCardId(null);
  };

  const toggleCardSlide = (id) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

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
        [prayerId]: {
          ...(prev[prayerId] || {}),
          loading: true,
          error: "",
        },
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

  const handleEditClick = (card) => {
    const currentUserId = currentUser?._id || currentUser?.id;
    const ownerId = card.createdBy?._id || card.createdBy?.id;
    const isOwner = ownerId === currentUserId;

    if (!isOwner) {
      alert("You can only edit your own prayers.");
      return;
    }

    setSelectedCard(card);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedCard(null);
  };

  const handleUpdatePrayer = async (updatedPrayerData) => {
    try {
      if (!selectedCard?._id) return;

      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Please log in to edit a prayer.");
        return;
      }

      const data = await request(`/api/prayers/${selectedCard._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPrayerData),
      });

      setCards((prev) =>
        prev.map((card) => (card._id === selectedCard._id ? data.prayer : card))
      );

      handleCloseEdit();
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not update prayer");
    }
  };

  return (
    <main className="cards">
      <section className="cards__header">
        <Link to="/" className="cards__page-link cards__page-link--left">
          ← Main Page
        </Link>

        <div className="cards__header-main">
          <h1 className="cards__title">Prayer Wall</h1>
          <p className="cards__subtitle">
            A place to pause, pray, and stand in faith together
          </p>
        </div>

        <Link to="/profile" className="cards__page-link cards__page-link--right">
          Your Profile →
        </Link>

        <div className="cards__counter">
          <span className="cards__counter-number">{salvationCount}</span>
          <span className="cards__counter-text">
            souls have given their lives to Christ
          </span>
        </div>
      </section>

      {loading && <p className="cards__muted">Loading cards...</p>}
      {error && <p className="cards__error">{error}</p>}

      <section className="cards__layout">
        <aside className="categories">
          <h3>Categories</h3>
          <ul>
            {PRAYER_CATEGORIES.map((category) => {
              const count = getCategoryMatches(category).length;

              return (
                <li key={category}>
                  <button
                    className={`categories__btn ${
                      activeCategory === category ? "categories__btn--active" : ""
                    }`}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}{" "}
                    <span className="categories__count">({count})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="feed">
          {!loading && !error && filteredCards.length === 0 && (
            <div className="cards__empty">
              <h3>No {activeCategory.toLowerCase()} prayers yet</h3>
              <p>Be the first to share a prayer in this category.</p>
            </div>
          )}

          <ul className="cards__list">
            {filteredCards.map((card) => {
              const ref = card.scripture;
              const v = verseState[card._id] || {};
              const verseBtnLabel = v.isOpen ? "Hide Verse" : "View Verse";
              const likesCount = card.likes?.length || 0;
              const prayedCount = card.prayedCount || 0;
              const isOpen = openCardId === card._id;
              const currentUserId = currentUser?._id || currentUser?.id;
              const ownerId = card.createdBy?._id || card.createdBy?.id;
              const isOwner = ownerId === currentUserId;

              return (
                <li
                  className={`cards__item ${isOpen ? "cards__item--open" : ""}`}
                  key={card._id}
                  onClick={() => toggleCardSlide(card._id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleCardSlide(card._id);
                    }
                  }}
                >
                  <div className="cards__track">
                    <div className="cards__panel cards__panel--front">
                      <div
                        className="cards__cover"
                        style={{ backgroundImage: `url(${getNatureImage(card)})` }}
                        aria-hidden="true"
                      />
                      <div className="cards__overlay" aria-hidden="true" />

                      <div className="cards__content">
                        <div className="cards__top">
                          <div>
                            <h3 className="cards__item-title">{card.title}</h3>
                          </div>

                          <button
                            className="cards__btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVerse(card);
                            }}
                            disabled={!ref}
                          >
                            {verseBtnLabel}
                          </button>
                        </div>

                        <div className="cards__actions">
                          <button
                            className="cards__btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(card._id);
                            }}
                          >
                            Like
                          </button>

                          <button
                            className="cards__btn cards__btn--pray"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePray(card._id);
                            }}
                          >
                            Pray on this
                          </button>

                          {isOwner && (
                            <button
                              className="cards__btn"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(card);
                              }}
                            >
                              Edit
                            </button>
                          )}

                          <span className="cards__likes">
                            {likesCount} like{likesCount === 1 ? "" : "s"} •{" "}
                            {prayedCount} prayer
                            {prayedCount === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="cards__hint">
                          {isOpen ? "Tap to go back" : "Tap to read"}
                        </div>
                      </div>
                    </div>

                    <div className="cards__panel cards__panel--back">
                      <div className="cards__content">
                        <div className="cards__top">
                          <div>
                            <h3 className="cards__item-title">{card.title}</h3>
                            <p className="cards__ref">{ref}</p>
                          </div>

                          <button
                            className="cards__btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVerse(card);
                            }}
                            disabled={!ref}
                          >
                            {verseBtnLabel}
                          </button>
                        </div>

                        {card.description && (
                          <p className="cards__msg">{card.description}</p>
                        )}

                        <div className="cards__verse">
                          {v.loading && (
                            <p className="cards__muted">Loading verse...</p>
                          )}
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

                          {!v.loading && !v.error && !v.text && (
                            <p className="cards__muted">
                              Tap “View Verse” to load scripture.
                            </p>
                          )}
                        </div>

                        <div className="cards__actions">
                          <button
                            className="cards__btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(card._id);
                            }}
                          >
                            Like
                          </button>

                          <button
                            className="cards__btn cards__btn--pray"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePray(card._id);
                            }}
                          >
                            Pray on this
                          </button>

                          {isOwner && (
                            <button
                              className="cards__btn"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(card);
                              }}
                            >
                              Edit
                            </button>
                          )}

                          <span className="cards__likes">
                            {likesCount} like{likesCount === 1 ? "" : "s"} •{" "}
                            {prayedCount} prayer
                            {prayedCount === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="cards__hint">Tap to go back</div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </section>

      {isEditOpen && selectedCard && (
        <AddPrayerModal
          isOpen={isEditOpen}
          onClose={handleCloseEdit}
          onSubmit={handleUpdatePrayer}
          seed={selectedCard}
          mode="edit"
        />
      )}
    </main>
  );
}

export default Cards;