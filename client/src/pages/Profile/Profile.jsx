import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import { getMyPrayers, updateMe } from "../../utils/api";

export default function Profile({ currentUser, onUserUpdate }) {
    const navigate = useNavigate();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [myPrayers, setMyPrayers] = useState([]);
    const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
    const [prayersError, setPrayersError] = useState("");

    function goBack() {
        navigate("/cards");
    }

    useEffect(() => {
        if (!currentUser) return;

        let ignore = false;

        async function loadMyPrayers() {
            setIsLoadingPrayers(true);
            setPrayersError("");

            try {
                const data = await getMyPrayers();

                if (!ignore) {
                    setMyPrayers(Array.isArray(data?.prayers) ? data.prayers : []);
                }
            } catch (err) {
                if (!ignore) {
                    setPrayersError(err.message || "Could not load your prayers.");
                }
            } finally {
                if (!ignore) {
                    setIsLoadingPrayers(false);
                }
            }
        }

        loadMyPrayers();

        return () => {
            ignore = true;
        };
    }, [currentUser]);

    async function handleSaveProfile(payload) {
        setIsSaving(true);
        setSaveError("");

        try {
            const updated = await updateMe(payload);
            const updatedUser = updated?.user || updated;

            if (updatedUser && typeof onUserUpdate === "function") {
                onUserUpdate(updatedUser);
            }

            setIsEditOpen(false);
        } catch (err) {
            setSaveError(err.message || "Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    }

    function formatSalvationDate(dateValue) {
        if (!dateValue) return null;

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return null;

        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(date);
    }

    const salvationStatus = currentUser?.salvationStatus || null;
    const salvationDate =
        currentUser?.salvationDate ||
        currentUser?.salvationRecordedAt ||
        currentUser?.savedAt ||
        null;

    const formattedSalvationDate = formatSalvationDate(salvationDate);

    let salvationHeading = "No salvation response recorded yet";
    let salvationMessage =
        "When you choose a salvation option in Selah, your journey will be reflected here.";
    let salvationLabel = "✝ Faith Journey";

    if (salvationStatus === "saved_today") {
        salvationLabel = "✝ Your Salvation Date";
        salvationHeading = formattedSalvationDate || "Today";
        salvationMessage =
            "Welcome to the family of God. Your salvation has been recorded.";
    }

    if (salvationStatus === "already_saved") {
        salvationLabel = "✝ Saved Before Joining Selah";
        salvationHeading =
            formattedSalvationDate || "Known to God, exact date not remembered";
        salvationMessage =
            "Your salvation journey has been saved to your profile.";

        if (currentUser?.salvationDateEstimated) {
            salvationMessage =
                "Your salvation journey has been saved to your profile. The date shown is approximate.";
        }
    }

    if (salvationStatus === "exploring") {
        salvationLabel = "✝ Faith Journey";
        salvationHeading = "Still exploring faith";
        salvationMessage =
            "You are always welcome here. Take your time — God is near.";
    }

    if (!currentUser) {
        return (
            <main className="profile">
                <div className="profile__container">
                    <button className="profile__back" type="button" onClick={goBack}>
                        ← Back to Prayers
                    </button>

                    <section className="profile__hero profile__hero--signedOut">
                        <p className="profile__eyebrow">Your Selah Space</p>
                        <h1 className="profile__title">Profile</h1>
                        <p className="profile__subtitle">
                            Please sign in to view your profile, prayers, and spiritual journey.
                        </p>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="profile">
            <div className="profile__container">
                <button className="profile__back" type="button" onClick={goBack}>
                    ← Back to Prayers
                </button>

                <section className="profile__hero">
                    <div>
                        <p className="profile__eyebrow">Your Selah Space</p>
                        <h1 className="profile__title">Profile</h1>
                        <p className="profile__subtitle">
                            A peaceful place to view your prayers, reflect on your journey,
                            and keep meaningful moments close.
                        </p>
                    </div>

                    <button
                        className="profile__editBtn"
                        type="button"
                        onClick={() => setIsEditOpen(true)}
                    >
                        Edit Profile
                    </button>
                </section>

                <section className="profile__topGrid">
                    <article className="profile__card profile__card--identify">
                        <img
                            className="profile__avatar"
                            src={
                                currentUser.profilePic ||
                                "https://ui-avatars.com/api/?name=User&background=E9EFE8&color=355846&size=128"
                            }
                            alt={`${currentUser.displayName} avatar`}
                            referrerPolicy="no-referrer"
                        />

                        <div className="profile__identityText">
                            <p className="profile__label">Profile</p>
                            <h2 className="profile__name">{currentUser.displayName}</h2>
                            <p className="profile__email">{currentUser.email}</p>
                        </div>
                    </article>

                    <article className="profile__card profile__card--salvation">
                        <div className="profile__cardAccent" />
                        <p className="profile__label">{salvationLabel}</p>

                        <h2
                            className={`profile__salvationDate ${
                                !salvationStatus ? "profile__salvationDate--empty" : ""
                            }`}
                        >
                            {salvationHeading}
                        </h2>

                        <p className="profile__salvationText">{salvationMessage}</p>

                        {currentUser?.salvationTestimony ? (
                            <div className="profile__testimony">
                                <p className="profile__testimonyLabel">Testimony</p>
                                <p className="profile__testimonyText">
                                    {currentUser.salvationTestimony}
                                </p>
                            </div>
                        ) : null}
                    </article>
                </section>

                <section className="profile__stats">
                    <article className="profile__statCard">
                        <span className="profile__statLabel">Total Prayers</span>
                        <span className="profile__statValue">{myPrayers.length}</span>
                    </article>

                    <article className="profile__statCard">
                        <span className="profile__statLabel">Prayer Space</span>
                        <span className="profile__statValue">Personal Sanctuary</span>
                    </article>
                </section>

                <section className="profile__section">
                    <div className="profile__sectionHeader">
                        <div>
                            <p className="profile__eyebrow">Prayer Collection</p>
                            <h2 className="profile__sectionTitle">My Prayers</h2>
                        </div>
                    </div>

                    {isLoadingPrayers ? (
                        <p className="profile__muted">Loading your prayers...</p>
                    ) : null}

                    {prayersError ? (
                        <p className="profile__error">{prayersError}</p>
                    ) : null}

                    {!isLoadingPrayers && !prayersError && myPrayers.length === 0 ? (
                        <div className="profile__emptyState">
                            <h3 className="profile__emptyTitle">No prayers yet</h3>
                            <p className="profile__muted">
                                Start adding prayers and they'll appear here in your personal
                                sanctuary.
                            </p>
                        </div>
                    ) : null}

                    <div className="profile__prayerGrid">
                        {myPrayers.map((p) => (
                            <article key={p._id} className="profile__prayerCard">
                                <div className="profile__prayerAccent" />

                                <div className="profile__prayerContent">
                                    <div className="profile__prayerTop">
                                        <div>
                                            <p className="profile__prayerMeta">Personal Prayer</p>
                                            <h3 className="profile__prayerTitle">
                                                {p.title || "Untitled prayer"}
                                            </h3>
                                        </div>

                                        <button
                                            type="button"
                                            className="profile__prayerEditBtn"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    {p.description ? (
                                        <p className="profile__prayerDesc">{p.description}</p>
                                    ) : (
                                        <p className="profile__prayerDesc profile__prayerDesc--muted">
                                            No description added yet.
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <EditProfileModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    currentUser={currentUser}
                    onSave={handleSaveProfile}
                    isSubmitting={isSaving}
                    error={saveError}
                />
            </div>
        </main>
    );
}
  