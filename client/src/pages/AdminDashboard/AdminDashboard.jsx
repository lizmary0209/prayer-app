import { useEffect, useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPrayers: 0,
        salvationDecisions: 0,
        prayerResponses: 0,
    });

    const fetchStats = async () => {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
    };

    useEffect(() => {
        console.log("Admin Dashboard loaded!");
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
                    <p className="stat-card__number">--</p>
                </article>

                <article className="stat-card">
                    <h2>Prayer Requests</h2>
                    <p className="stat-card__number">--</p>
                </article>

                <article className="stat-card">
                    <h2>Salvation Decisions</h2>
                    <p className="stat-card__number">--</p>
                </article>

                <article className="stat-card">
                    <h2>Prayer Responses</h2>
                    <p className="stat-card__number">--</p>
                </article>
            </section>

            <section className="admin__coming-soon">
                <h2>Coming Next</h2>

                <ul>
                    <li>Recent Prayer Requests</li>
                    <li>Recent Members</li>
                    <li>Recent Salvation Decisions</li>
                    <li>Community Analytics</li>
                </ul>
            </section>
        </main>
    );
}