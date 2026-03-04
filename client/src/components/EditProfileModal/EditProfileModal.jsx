import { useEffect, useState } from "react";
import "./EditProfileModal.css";

export default function EditProfileModal({
    isOpen, 
    onClose, 
    currentUser,
    onSave,
    isSubmitting = false,
    error = "",
}) {
    const [displayName, setDisplayName] = useState("");
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setDisplayName(currentUser?.displayName || "");
        setProfilePic(currentUser?.profilePic || "");
    }, [isOpen, currentUser]);

    function handleOverlayClick() {
        onClose();
    }

    function handleContentClick(e) {
        e.stopPropagation();
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave({
            displayName: displayName.trim(),
            profilePic: profilePic.trim(),
        });
    }

    if (!isOpen) return null;

    return (
        <div className="editProfileModal" onMouseDown={handleOverlayClick}>
            <div className="editProfileModal__content" onMouseDown={handleContentClick}>
                <div className="editProfileModal__header">
                    <h2 className="editProfileModal__title">Edit Profile</h2>
                    <button
                    className="editProfileModal__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form className="editProfileModal__form" onSubmit={handleSubmit}>
                    <label className="editProfileModal__label">
                        Display Name
                        <input
                        className="editProfileModal__input"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        minLength={2}
                        maxLength={40}
                        required
                        placeholder="e.g., Lizmary"
                        />
                    </label>

                    <label className="editProfileModal__label">
                        Avatar URL (optional)
                        <input
                        className="editProfileModal__input"
                        type="url"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        placeholder="https://..."
                        />
                    </label>

                    {error ? <p className="editProfileModal__error">{error}</p> : null}

                    <button
                    className="editProfileModal__submit"
                    type="submit"
                    disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
}