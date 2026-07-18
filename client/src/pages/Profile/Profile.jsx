import { useEffect, useState } from "react";
import "./Profile.css";

import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import AddPrayerModal from "../../components/AddPrayerModal/AddPrayerModal";
import { getMyPrayers, updateMe } from "../../utils/api";

const PRAYER_CATEGORY_LABELS = {
    sunrise: "Hope & Joy",
    water: "Peace & Rest",
    mountains: "Strength & Courage",
    forest: "Healing & Comfort",
    fields: "Provision & Growth",
    neutral: "Simple / Neutral",
};

export default function Profile({ currentUser, onUserUpdate, onEditSalvationJourney }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [myPrayers, setMyPrayers] = useState([]);
    const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
    const [prayersError, setPrayersError] = useState("");

    const [isPrayerEditOpen, setIsPrayerEditOpen] = useState(false);
    const [editingPrayer, setEditingPrayer] = useState(null);
   

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

    function openPrayerEditModal(prayer) {
        setEditingPrayer(prayer);
        setIsPrayerEditOpen(true);
    }

    function closePrayerEditModal() {
        setIsPrayerEditOpen(false);
        setEditingPrayer(null);
    }

async function handleSavePrayerEdit(updatedPrayerData) {
  if (!editingPrayer?._id) return;

  try {
    const { updatePrayer } = await import("../../utils/api");

    const updated = await updatePrayer(
      editingPrayer._id,
      updatedPrayerData
    );

    const updatedPrayer = updated?.prayer || updated;

    setMyPrayers((prev) =>
      prev.map((prayer) =>
        prayer._id === editingPrayer._id
          ? updatedPrayer
          : prayer
      )
    );

    closePrayerEditModal();
  } catch (err) {
    throw new Error(err.message || "Failed to update prayer.");
  }
}

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") {
                setIsEditOpen(false);
                closePrayerEditModal();
            }
        }

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    function formatSalvationDate(dateValue, salvationStatus) {
        if (!dateValue) return null;

        if (salvationStatus === "saved_today") {
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

    const dateOnly = String(dateValue).slice(0, 10);
    const [year, month, day] = dateOnly.split("-").map(Number);

    if (!year || !month || !day) return null;

    const localDate = new Date(year, month -1, day);

    return new Intl.DateTimeFormat("en-US", {
        month: "long", 
        day: "numeric",
        year: "numeric",
    }).format(localDate);
}


    const salvationStatus = currentUser?.salvationStatus || null;
    const salvationDate =
        currentUser?.salvationDate ||
        currentUser?.salvationRecordedAt ||
        currentUser?.savedAt ||
        null;

    const formattedSalvationDate = formatSalvationDate(
        salvationDate,
    salvationStatus
);

    let salvationHeading = "No salvation response recorded yet";
    let salvationMessage =
        "When you choose a salvation option in Selah, your journey will be reflected here.";
    let salvationLabel = "Faith Journey";

    if (salvationStatus === "saved_today") {
        salvationLabel = "Your Salvation Date";
        salvationHeading = formattedSalvationDate || "Today";
        salvationMessage =
            "Welcome to the family of God. Your salvation has been recorded.";
    }

    if (salvationStatus === "already_saved") {
        salvationLabel = "Saved Before Joining Selah";
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
        salvationLabel = "Faith Journey";
        salvationHeading = "Still exploring faith";
        salvationMessage =
            "You are always welcome here. Take your time - God is near.";
    }

    if (!currentUser) {
        return (
            <main className="profile">
                <div className="profile__container">
                    <section className="profile__hero profile__hero--signedOut">
                        <p className="profile__eyebrow">My Selah</p>
                        <h1 className="profile__title">Your Prayer Space</h1>
                        <p className="profile__subtitle">
                            Please sign in to view your prayer wall activity, prayers, and faith journey.
                        </p>
                    </section>
                </div>
            </main>
        );
    }

    return (
        <main className="profile">
            <div className="profile__container">
                <section className="profile__hero">
                    <div>
                        <p className="profile__eyebrow">My Selah</p>
                        <h1 className="profile__title">Your Prayer Space</h1>
                        <p className="profile__subtitle">
                            A peaceful place to view your prayer activity, reflect on your faith journey,
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
                    <article className="profile__card profile__card--identity">
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
                            <p className="profile__label">Account</p>
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

                        <button
                                className="profile__salvationEditBtn"
                                type="button"
                                onClick={onEditSalvationJourney}
                                >
                                    Edit Salvation Journey
                                </button>
                    </article>
                </section>

                <section className="profile__stats">
                    <article className="profile__statCard">
                        <span className="profile__statLabel">Total Prayers</span>
                        <span className="profile__statValue">{myPrayers.length}</span>
                    </article>

                    <article className="profile__statCard">
                        <span className="profile__statLabel">Selah Activity</span>
                        <span className="profile__statValue">Prayer Wall</span>
                    </article>
                </section>

                <section className="profile__section">
                    <div className="profile__sectionHeader">
                        <div>
                            <p className="profile__eyebrow">Selah Activity</p>
                            <h2 className="profile__sectionTitle">My Prayers</h2>
                        </div>
                    </div>

                    {isLoadingPrayers ? (
                        <div className="profile__state">
                            <p className="profile__stateKicker">My Prayers</p>
                            <h3>Loading your prayers...</h3>
                            <p>Gathering what you have shared on the prayer wall.</p>
                        </div>
                    ) : null}

                    {prayersError ? (
                        <div className="profile__state profile__state--error">
                            <p className="profile__stateKicker">Something went wrong</p>
                            <h3>Could not load your prayers</h3>
                            <p>{prayersError}</p>
                        </div>
                    ) : null}

                    {!isLoadingPrayers && !prayersError && myPrayers.length === 0 ? (
                        <div className="profile__emptyState">
                            <h3 className="profile__emptyTitle">No prayers yet</h3>
                            <p className="profile__muted">
                                Start adding prayers and they'll appear here in your Selah activity.
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
                                            <div className="profile__prayerDetails">
                                                <span>
                                                    {PRAYER_CATEGORY_LABELS[p.category] ||
                                                        PRAYER_CATEGORY_LABELS.neutral}
                                                </span>

                                               <span
                                               className={`profile__privacyBadge ${
                                            p.visibility === "private"
                                            ? "profile__privacyBadge--private"
                                            : "profile__privacyBadge--public"   
                                            }`}
                                            >
                                                {p.visibility === "private" ? "🔒 Private" : "🌍 Public"}
                                                </span>

                                                {p.scripture ? <span>{p.scripture}</span> : null}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="profile__prayerEditBtn"
                                            onClick={() => openPrayerEditModal(p)}
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

                <AddPrayerModal
                isOpen={isPrayerEditOpen}
                onClose={closePrayerEditModal}
                onSubmit={handleSavePrayerEdit}
                seed={editingPrayer}
                mode="edit"
                />

                            
            </div>
        </main>
    );
}
  
