import { useEffect, useMemo, useState } from "react";
import Modal from "../Modal/Modal";
import { createPrayer } from "../../utils/api";
import "./AddPrayerModal.css";

const CATEGORY_OPTIONS = [
  { value: "sunrise", label: "Hope & Joy" },
  { value: "water", label: "Peace & Rest" },
  { value: "mountains", label: "Strength & Courage" },
  { value: "forest", label: "Healing & Comfort" },
  { value: "fields", label: "Provision & Growth" },
  { value: "neutral", label: "Simple / Neutral" },
];

export default function AddPrayerModal({ isOpen, onClose, onSubmit, seed, mode = "add" }) {
  const initialTitle = useMemo(() => seed?.title || "", [seed]);
  const initialScripture = useMemo(() => seed?.scripture || "", [seed]);
  const initialDescription = useMemo(() => seed?.description || "", [seed]);
  const initialCategory = useMemo(() => seed?.category || "neutral", [seed]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scripture, setScripture] = useState("");
  const [category, setCategory] = useState("neutral");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;


    setTitle(initialTitle);
    setDescription(initialDescription);
    setScripture(initialScripture);
    setCategory(initialCategory);
    setError("");
    setIsSaving(false);
  }, [isOpen, initialTitle, initialDescription, initialScripture, initialCategory]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and a prayer.");
      return;
    }

    const prayerData = {
      title: title.trim(),
      description: description.trim(),
      scripture: scripture.trim(),
      category,
    };

    setIsSaving(true);


    try {
      if (onSubmit) {
        await onSubmit(prayerData);
      } else {
        await createPrayer(prayerData);
      }

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
      title={mode === "edit" ? "Edit Prayer" : "Add a Prayer"}
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
            {isSaving
             ? "Saving..."
             : mode === "edit"
             ? "Save Changes"
             : "Save Prayer"}
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

        <label className="add-prayer__label"> Prayer Theme</label>
        <select
        className="add-prayer__input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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
