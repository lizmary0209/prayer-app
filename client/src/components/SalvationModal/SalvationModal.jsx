import { useEffect, useState } from "react";
import "./SalvationModal.css";
import { recordSalvation } from "../../utils/api";

export default function SalvationModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("initial");
  const [date, setDate] = useState("");
  const [isEstimated, setIsEstimated] = useState(false);
  const [testimony, setTestimony] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep("initial");
      setDate("");
      setIsEstimated(false);
      setTestimony("");
      setLoading(false);
      setSuccessMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const closeAndReset = () => {
    setStep("initial");
    setDate("");
    setIsEstimated(false);
    setTestimony("");
    setLoading(false);
    setSuccessMessage("");
    onClose();
  };

  const handleRecordSalvation = async (payload) => {
    try {
      setLoading(true);

      const res = await recordSalvation(payload);

      await onSuccess?.(res);

      setSuccessMessage(res?.message || "Your response has been recorded.");
      setStep("success");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavedToday = () => {
    handleRecordSalvation({
      salvationStatus: "saved_today",
    });
  };

  const handleExploring = () => {
    handleRecordSalvation({
      salvationStatus: "exploring",
    });
  };

  const handleAlreadySavedSubmit = () => {
    handleRecordSalvation({
      salvationStatus: "already_saved",
      salvationDate: date || null,
      salvationDateEstimated: isEstimated,
      salvationTestimony: testimony,
    });
  };

  return (
    <div className="salvation-modal">
      <div
        className="salvation-modal__content">
        <button
          type="button"
          className="salvation-modal__close"
          onClick={closeAndReset}
          aria-label="Close salvation modal"
        >
          ×
        </button>

        {step === "initial" && (
          <>
            <h2 className="salvation-modal__title">
              Have you made the decision to follow Jesus?
            </h2>

            <p className="salvation-modal__text">
              Lord Jesus, I acknowledge that I am a sinner who needs your
              forgiveness. I believe that you died for my sins. I repent of my
              sins and want to leave them behind. I invite you to come into my
              life today. I trust you as my Savior and I will follow you as my
              Lord. Write my name in the book of life and help me to follow you
              all the days of my life. In Jesus name, Amen.
            </p>

            <div className="salvation-modal__actions">
              <button
                className="salvation-modal__confirm"
                onClick={handleSavedToday}
                disabled={loading}
              >
                {loading ? "Recording..." : "I Gave My Life to Jesus Today"}
              </button>

              <button
                className="salvation-modal__secondary"
                onClick={() => setStep("already")}
                disabled={loading}
              >
                I Was Already Saved
              </button>

              <button
                className="salvation-modal__secondary"
                onClick={handleExploring}
                disabled={loading}
              >
                I'm Still Exploring Faith
              </button>
            </div>
          </>
        )}

        {step === "already" && (
          <>
            <h2 className="salvation-modal__title">
              Tell us about your salvation
            </h2>

            <label className="salvation-modal__label">
              Date <span>(optional)</span>
            </label>
            <input
              className="salvation-modal__input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label className="salvation-modal__checkbox">
              <input
                type="checkbox"
                checked={isEstimated}
                onChange={(e) => setIsEstimated(e.target.checked)}
              />
              I don't remember the exact date
            </label>

            <label className="salvation-modal__label">
              Testimony <span>(optional)</span>
            </label>
            <textarea
              className="salvation-modal__textarea"
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              placeholder="Share your story..."
            />

            <div className="salvation-modal__actions">
              <button
                className="salvation-modal__confirm"
                onClick={handleAlreadySavedSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save My Salvation"}
              </button>

              <button
                className="salvation-modal__secondary"
                onClick={() => setStep("initial")}
                disabled={loading}
              >
                Back
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="salvation-modal__success">
            <p className="salvation-modal__success-icon">✝</p>

            <h2 className="salvation-modal__title">
              Your response has been recorded
            </h2>

            <p className="salvation-modal__text">{successMessage}</p>

            <button
              className="salvation-modal__confirm"
              onClick={closeAndReset}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}