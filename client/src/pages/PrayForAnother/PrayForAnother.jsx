import { useEffect, useState } from "react";
import { getPrayerForAnother, prayForPrayer } from "../../utils/api";
import "./PrayForAnother.css";

export default function PrayForAnother() {
    const [prayer, setPrayer] = useState(null);
    const [seenPrayerIds, setSeenPrayerIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    

    async function loadPrayer(excludeIds = seenPrayerIds) {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data = await getPrayerForAnother(excludeIds);

            setPrayer(data.prayer);
        } catch (err) {
            setPrayer(null);

            if (err.message === "No prayer requests are available right now.") {
                setMessage(
                    "You've prayed through all available requests for now. Check back again soon. 🙏🏽"
                );
            } else {
                setError("Unable to load a prayer right now. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPrayer([]);
    }, []);

    async function handleShowAnother() {
        if (!prayer?._id) return;

        const updatedSeenIds = [...seenPrayerIds, prayer._id];

        setSeenPrayerIds(updatedSeenIds);

        await loadPrayer(updatedSeenIds);
    }


    if (loading) {
        return (
            <main className="pray-another">
                <p className="pray-another__status">
                    Finding someone you can pray for...
                </p>
            </main>
        );
    }

    async function handlePrayed() {
        if (!prayer?._id) return;

        try {
            setError("");

            await prayForPrayer(prayer._id);

            const updatedSeenIds = [...seenPrayerIds, prayer._id];

            setSeenPrayerIds(updatedSeenIds);
            setMessage("Thank you for praying. 🙏🏽 Finding someone else who needs prayer...");

            setTimeout(() => {
                loadPrayer(updatedSeenIds);
            }, 1200);
        } catch (err) {
            console.error("Unable to record prayer:", err);
            setError("Unable to record your prayer right now. Please try again.");
        }
    }

    return (
        <main className="pray-another">
            <section className="pray-another__hero">
                <p className="pray-another__eyebrow">Pause • Pray • Encourage</p>

                <h1>Pray for Another</h1>

                <p>
                    Take a moment to lift up someone in the Selah community.
                </p>
            </section>

            {error && (
                <p className="pray-another__status pray-another__status--error">
                    {error}
                </p>
            )}

            {message && (
                <section className="pray-another__empty">
                    <p>{message}</p>
                </section>
            )}

            {prayer && (
                <article className="pray-another__card">
                    <div className="pray-another__person">
                        {prayer.createdBy?.profilePic && (
                            <img
                            src={prayer.createdBy.profilePic}
                            alt=""
                            className="pray-another__avatar"
                            />
                        )}

                        <span>
                            {prayer.createdBy?.displayName || "A Selah community member"}
                        </span>
                    </div>

                    <h2>{prayer.title}</h2>

                    <p className="pray-another__description">
                        {prayer.description}
                    </p>

                    {prayer.scripture && (
                        <blockquote className="pray-another__scripture">
                            {prayer.scripture}
                        </blockquote>
                    )}

                    <p className="pray-another__support">
                      {prayer.prayedCount === 0
                      ? "🙏🏽 Be the first to pray"
                      : `🙏🏽 ${prayer.prayedCount} ${prayer.prayedCount === 1
                        ? "Person has prayed"
                        : "people have prayed"
                      }`}   
                    </p>

                    <div className="pray-another__actions">
                        <button type="button" className="pray-another__primary"
                        onClick={handlePrayed}
                        >
                            I Prayed 🙏🏽
                        </button>

                        <button 
                        type="button"
                        className="pray-another__secondary"
                        onClick={handleShowAnother}
                        >
                            Show Me Another
                        </button>
                    </div>
                </article>
            )}
        </main>
    )
}