import { useState } from "react";
import "./EditProfileModal.css";

export default function EditProfileModal({
    isOpen,
    onClose,
    currentUser,
    onSave,
    isSubmitting = false,
    error = "",
}) {
    if (!isOpen) return null;

    return (
        <div className="editProfileModal">
            <div className="editProfileModal__content">
                <div className="editProfileModal__header">
                    <h2 className="editProfileModal__title">Edit Your Selah Profile</h2>
                    <button
                    className="editProfileModal__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    >
                        x
                    </button>
                </div>

                <EditProfileForm
                    key={currentUser?._id || currentUser?.id || "profile"}
                    currentUser={currentUser}
                    onSave={onSave}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            </div>
        </div>
    );
}

function EditProfileForm({ currentUser, onSave, isSubmitting, error }) {
    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [profilePic, setProfilePic] = useState(currentUser?.profilePic || "");
    const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

    function handlePhotoChange(e) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    e.target.value = "";
    return;
  }

  const maxFileSize = 5 * 1024 * 1024; // 5MB

  if (file.size > maxFileSize) {
    alert("Please choose an image smaller than 5MB.");
    e.target.value = "";
    return;
  }

  setIsProcessingPhoto(true);

  const reader = new FileReader();

  reader.onerror = () => {
    alert("There was a problem reading this image. Please try another photo.");
    setIsProcessingPhoto(false);
    e.target.value = "";
  };

  reader.onload = () => {
    const img = new Image();

    img.onerror = () => {
      alert("There was a problem loading this image. Please try another photo.");
      setIsProcessingPhoto(false);
      e.target.value = "";
    };

    img.onload = () => {
      const maxSize = 300;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert("There was a problem processing this image. Please try again.");
        setIsProcessingPhoto(false);
        e.target.value = "";
        return;
      }

      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

      setProfilePic(compressedImage);
      setIsProcessingPhoto(false);
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
}

   function handleSubmit(e) {
    e.preventDefault();


    onSave({
        displayName: displayName.trim(),
        profilePic,
    });
   }

    return (
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
                Profile Photo
                <input
                className="editProfileModal__input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={isProcessingPhoto}
                />
            </label>

            {error ? <p className="editProfileModal__error">{error}</p> : null}

            <button
            className="editProfileModal__submit"
            type="submit"
            disabled={isSubmitting || isProcessingPhoto}
            >
                {isProcessingPhoto
    ? "Processing photo..."
    : isSubmitting
      ? "Saving..."
      : "Save Changes"}
            </button>
        </form>
    );
}
