import { useEffect, useState } from "react";
import {
     getAdminStats,
    getRecentAdminPrayers,
 } from "../../utils/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPrayers: 0,
        salvationDecisions: 0,
        prayerResponses: 0,
        awaitingFirstPrayer: 0,
    });

    const [recentPrayers, setRecentPrayers] = useState([]);

   const fetchStats = async () => {
    const data = await getAdminStats();
    setStats(data);
   }

   const fetchRecentPrayers = async () => {
    const data = await getRecentAdminPrayers();
    setRecentPrayers(Array.isArray(data?.prayers) ? data.prayers : []);
   };

    useEffect(() => {
        fetchStats();
        fetchRecentPrayers();
    }, []);


    return (
        <main className="admin">
            <section className="admin__hero">
                <h1 className="admin__title">Selah Admin Dashboard</h1>
                <p className="admin__subtitle">Welcome back! Here's an overview of your Selah community.
                </p>
            </section>

            <section className="admin__stats">
                <article className="stat-card">
                    <h2>Total Users</h2>
                    <p className="stat-card__number">{stats.totalUsers}</p>
                </article>

                <article className="stat-card">
                    <h2>Prayer Requests</h2>
                    <p className="stat-card__number">{stats.totalPrayers}</p>
                </article>

                <article className="stat-card">
                    <h2>Salvation Decisions</h2>
                    <p className="stat-card__number">{stats.salvationDecisions}</p>
                </article>

                <article className="stat-card">
                    <h2>Prayer Responses</h2>
                    <p className="stat-card__number">{stats.prayerResponses}</p>
                </article>

                <article className="stat-card">
                    <h2>Awaiting First Prayer</h2>
                    <p className="stat-card__number">{stats.awaitingFirstPrayer}</p>
                </article>
            </section>

            <section className="admin__recent">
                <div className="admin__section-header">
                    <div>
                    <p className="admin__section-eyebrow">Community Activity</p>
                    <h2>Recent Prayer Requests</h2>
                    </div>
                    </div>

                    <div className="admin__prayer-list">
                        {recentPrayers.length === 0 ? (
                            <p>No public prayer requests yet.</p>
                        ): (
                            recentPrayers.map((prayer) => (
                                <article key={prayer._id} className="admin__prayer-card">
                                    <div>
                                        <h3>{prayer.title}</h3>
                                        <p>{prayer.description}</p>
                                    </div>

                                    <div className="admin__prayer-meta">
                                        <span>
                                            🙏🏽 {prayer.prayedCount || 0}{" "}
                                            {prayer.prayedCount === 1 ? "person prayed" : "people prayed"}
                                        </span>

                                        {prayer.prayedCount === 0 ? (
                                            <span className="admin__needs-prayer">
                                                Needs First Prayer
                                            </span>
                                        ) : null}
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
            </section>
        </main>
    );
}