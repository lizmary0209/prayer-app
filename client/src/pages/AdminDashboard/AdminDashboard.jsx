import { useEffect, useState } from "react";
import {
     getAdminStats,
    getRecentAdminPrayers,
    getAdminUsers,
    getAwaitingAdminPrayers,
    deleteAdminPrayer,
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
    const [users, setUsers] = useState([]);
    const [awaitingPrayers, setAwaitingPrayers] = useState([]);
    const [showAwaitingPrayers, setShowAwaitingPrayers] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");

   const fetchStats = async () => {
    const data = await getAdminStats();
    setStats(data);
   }

   const fetchRecentPrayers = async () => {
    const data = await getRecentAdminPrayers();
    setRecentPrayers(Array.isArray(data?.prayers) ? data.prayers : []);
   };

   const fetchUsers = async () => {
    const data = await getAdminUsers();
    setUsers(Array.isArray(data?.users) ? data.users : []);
   };

   const fetchAwaitingPrayers = async () => {
    const data = await getAwaitingAdminPrayers();
    setAwaitingPrayers(Array.isArray(data?.prayers) ? data.prayers : []);
   };

   const handleDeletePrayer = async (prayerId) => {
    const confirmed = window.confirm(
        "Are you sure you want to remove this prayer request?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await deleteAdminPrayer(prayerId);

        setRecentPrayers((currentPrayers) => 
        currentPrayers.filter((prayer) => prayer._id !== prayerId)
        );

        setAwaitingPrayers((currentPrayers) => 
        currentPrayers.filter((prayer) => prayer._id !== prayerId)
    );

    await fetchStats();
    } catch (error) {
        console.error("Unable to remove prayer:", error);
    }
   };

    useEffect(() => {
        fetchStats();
        fetchRecentPrayers();
        fetchUsers();
        fetchAwaitingPrayers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const searchTerm = memberSearch.toLowerCase();

        return (
            user.displayName?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm)
        );
    });


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

                <button
                type="button"
                className="stat-card stat-card--clickable"
                onClick={() => setShowAwaitingPrayers((current) => !current)}
                aria-expanded={showAwaitingPrayers}
                aria-controls="awaiting-prayers"
                >
                    <h2>Awaiting First Prayer</h2>
                    <p className="stat-card__number">{stats.awaitingFirstPrayer}</p>
                </button>
            </section>

            {showAwaitingPrayers && (
                <section id="awaiting-prayers" className="admin__awaiting">
                    <div className="admin__section-header">
                        <div>
                            <p className="admin__section-eyebrow">Needs Support</p>
                            <h2>Awaiting First Prayer</h2>
                        </div>
                    </div>

                    {awaitingPrayers.length === 0 ? (
                        <div className="admin__awaiting-empty">
                            <p>🙏🏽 Every public prayer request has received support.</p>
                        </div>
                    ) : (
                        <div className="admin__prayer-list">
                            {awaitingPrayers.map((prayer) => (
                                <article key={prayer._id} className="admin__prayer-card">
                                    <div>
                                        <h3>{prayer.title}</h3>
                                        <p>{prayer.description}</p>
                                    </div>

                                    <span className="admin__needs-prayer">
                                        Needs First Prayer
                                    </span>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}

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

                                        <button
                                        type="button"
                                        className="admin__delete-button"
                                        onClick={() => handleDeletePrayer(prayer._id)}
                                        >
                                            Delete Prayer
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
            </section>

            <section className="admin__members">
                <div className="admin__section-header">
                    <div>
                                <p className="admin__section-eyebrow">Community</p>
                        <h2>Community Members</h2>
                    </div>
                        </div>

                        <input
                        type="search"
                        className="admin__member-search"
                        placeholder="Search members by name or email"
                        value={memberSearch}
                        onChange={(event) => setMemberSearch(event.target.value)}
                        aria-label="Search community members"
                        />

                
                        <div className="admin__member-list">
                            {filteredUsers.length === 0 ? (
                                <p>No community members yet.</p>
                            ) : (
                               filteredUsers.map((user) => (
                                    <article key={user._id} className="admin__member-card">
                                        <div>
                                            <h3>{user.displayName || "Selah Member"}</h3>
                                            <p>{user.email}</p>
                                        </div>

                                        <div className="admin__member-meta">
                                            <span>{user.role === "admin" ? "Admin" : "Member"}</span>

                                            <span>
                                                {user.salvationStatus === "saved_today"
                                                ? "Saved Today"
                                            : user.salvationStatus === "already_saved"
                                            ? "Already Saved"
                                        : user.salvationStatus === "exploring"
                                        ? "Exploring"
                                    : "Not Recorded"}
                                            </span>

                                            <span>
                                                Joined{" "}
                                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
            </section>
        </main>
    );
}