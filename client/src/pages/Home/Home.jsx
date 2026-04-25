import { useEffect, useState } from "react";
import { getSalvationCount } from "../../utils/api";
import "./Home.css";

function Home() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const data = await getSalvationCount();
                setCount(data.count || 0);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCount();
    }, []);

    return (
        <main className="home">
            <div className="home__overlay" />

            <section className="home__content">
                <h1 className="home__title">Selah</h1>

                <p className="home__subtitle">
                    A quiet place to pray, reflect, and draw closer to God.
                </p>

                <div className="home__counter">
                    <span className="home__count">{count}</span>
                    <span className="home__text">
                        souls have given their lives to Christ
                    </span>
                </div>

                <div className="home__actions">
                    <button className="home__btn">Enter Prayer Space</button>
                    <button className="home__btn home__btn--secondary">
                        Create Account
                    </button>
                </div>
            </section>
        </main>
    );
}

export default Home;