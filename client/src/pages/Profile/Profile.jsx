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
                if (!ignore) setIsLoadingPrayers(false);
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
            const updatedUser = updated?.user;

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


    if (!currentUser) {
        return (
            <main className="profile">
                <button className="profile__back" type="button" onClick={goBack}>
                    ← Back to Prayers
                </button>

                <h1 className="profile__title">Profile</h1>
                <p className="profile__signedout">Please sign in to view your profile.</p>
            </main>
        );
    }

    return (
        <main className="profile">
            <button className="profile__back" type="button" onClick={goBack}>
                ← Back to Prayers
            </button>

            <div className="profile__header">
                <h1 className="profile__title">Profile</h1>

                <button 
                className="profile__editBtn"
                type="button"
                onClick={() => setIsEditOpen(true)}
                >
                    Edit Profile
                </button>
            </div>

            <div className="profile__card">
                <img
                className="profile__avatar"
                src={currentUser.profilePic || "https://ui-avatars.com/api/?name=User"}
                alt={`${currentUser.displayName} avatar`}
                referrerPolicy="no-referrer"
                />

                <div>
                    <p className="profile__name">{currentUser.displayName}</p>
                    <p className="profile__email">{currentUser.email}</p>
                </div>
            </div>

            <section className="profile__section">
                <h2 className="profile__sectionTitle">My Prayers</h2>

                {isLoadingPrayers ? <p className="profile__muted">Loading...</p> : null}
                {prayersError ? <p className="profile__error">{prayersError}</p> : null}

                {!isLoadingPrayers && !prayersError && myPrayers.length === 0 ? (
                    <p className="profile__muted">You haven't added any prayers yet.</p>
                ) : null}

                <ul className="profile__list">
                    {myPrayers.map((p) => (
                        <li key={p._id} className="profile__listItem">
                            <div className="profile__prayerTitle">{p.title || "Untitled prayer"}</div>
                            {p.description ? (
                                <div className="profile__prayerDesc">{p.description}</div>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </section>

            <EditProfileModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            currentUser={currentUser}
            onSave={handleSaveProfile}
            isSubmitting={isSaving}
            error={saveError}
            />
        </main>
    );
}
  