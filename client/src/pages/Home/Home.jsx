import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalvationCount } from "../../utils/api";
import Counter from "../../components/Counter/Counter";
import "./Home.css";

function Home({ 
    isLoggedIn,
    salvationCount,
    setSalvationCount,
    salvationEvent,
    setSalvationEvent,
    onOpenRegister,
    }) {
        const navigate = useNavigate();
        const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const data = await getSalvationCount();
                setCount(data.count || 0);
                setSalvationCount?.(data.count || 0);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCount();
    }, [setSalvationCount]);

    return (
        <main className="home">
            <section className="home__hero" aria-label="Selah home hero">
            <div className="home__image-layer" />

            <section className="home__content">
                <p className="home__eyebrow">Pause • Pray • Remember</p>


                <h1 className="home__title">Selah</h1>

                <p className="home__subtitle">
                    A quiet place to pray, reflect, and draw closer to God.
                </p>

                <div className="home__counter">
                    <Counter 
                    value={salvationCount ?? count}
                     event={salvationEvent}
                      setEvent={setSalvationEvent}
                       />
                    <span className="home__text">
                        people have chosen to follow Jesus
                    </span>
                </div>

                <div className="home__actions">
                    <button 
                    className="home__btn"
                    type="button"
                    onClick={() => navigate("/cards")}
                    >
                        Enter Prayer Space
                        </button>

                        {!isLoggedIn && (
                          <button
                           className="home__btn home__btn--secondary"
                           type="button"
                           onClick={onOpenRegister}
                           >
                        Create Account
                    </button>
                        )}
                  </div>
            </section>
        </section>

        <section className="home__intro">
            <p className="home__intro-kicker">A prayer wall for real moments</p>
            <h2 className="home__intro-title">
                Share what is on your heart, or quietly stand with someone else in prayer. 
            </h2>
            <p className="home__intro-text">
                Selah is being built as a peaceful space for prayer, encouragement, testimony, and reflection - a reminder that no prayer is too small and no person is forgotten. 
            </p>
        </section>
    </main>
    );
}

export default Home;