import { useEffect, useMemo, useState } from "react";
import Modal from "../Modal/Modal";
import { createPrayer } from "../../utils/api";
import "./AddPrayerModal.css";

export default function AddPrayerModal({ isOpen, onClose, seed }) {
  const initialTitle = useMemo(() => seed?.title || "", [seed]);
  const initialScripture = useMemo(() => seed?.reference || "", [seed]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scripture, setScripture] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialTitle);
    setDescription("");
    setScripture(initialScripture);
    setError("");
    setIsSaving(false);
  }, [isOpen, initialTitle, initialScripture]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and a prayer.");
      return;
    }

    setIsSaving(true);
    try {
      await createPrayer({
        title: title.trim(),
        description: description.trim(),
        scripture: scripture.trim(),
      });

      onClose();
    } catch (err) {
      setError(err.message || "Could not save prayer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a Prayer"
      size="md"
      footer={
        <>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            className="btn btn--primary"
            type="submit"
            form="add-prayer-form"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Prayer"}
          </button>
        </>
      }
    >
      <form id="add-prayer-form" className="add-prayer" onSubmit={handleSubmit}>
        <label className="add-prayer__label">Title</label>
        <input
          className="add-prayer__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Peace in my heart"
        />

        <label className="add-prayer__label">Scripture (optional)</label>
        <input
          className="add-prayer__input"
          value={scripture}
          onChange={(e) => setScripture(e.target.value)}
          placeholder="e.g. Philippians 4:6–7"
        />

        <label className="add-prayer__label">Prayer</label>
        <textarea
          className="add-prayer__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your prayer here..."
          rows={8}
        />

        {error && <p className="add-prayer__error">{error}</p>}

        <p className="add-prayer__hint">
          Tip: Selah is about pausing — your words don’t need to be perfect.
        </p>
      </form>
    </Modal>
  );
}
