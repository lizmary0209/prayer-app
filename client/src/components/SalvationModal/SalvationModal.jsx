import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { recordSalvation } from "../../utils/api";
import "./SalvationModal.css";

export default function SalvationModal({
  isOpen,
  onClose,
  onSuccess,
  initialStep = "initial",
  initialData = null,
}) {
  const [step, setStep] = useState("initial");
  const [date, setDate] = useState("");
  const [isEstimated, setIsEstimated] = useState(false);
  const [testimony, setTestimony] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    const dateOnly = String(dateValue).slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      return dateOnly;
    }

    return "";
  };

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setDate(formatDateForInput(initialData?.salvationDate));
      setIsEstimated(Boolean(initialData?.salvationDateEstimated));
      setTestimony(initialData?.salvationTestimony || "");
      setLoading(false);
      setSuccessMessage("");
      setError("");
      return;
    }

    setStep("initial");
    setDate("");
    setIsEstimated(false);
    setTestimony("");
    setLoading(false);
    setSuccessMessage("");
    setError("");
  }, [isOpen, initialStep, initialData]);

  const closeAndReset = () => {
    setStep("initial");
    setDate("");
    setIsEstimated(false);
    setTestimony("");
    setLoading(false);
    setSuccessMessage("");
    setError("");
    onClose();
  };

  const handleRecordSalvation = async (payload) => {
    try {
      setLoading(true);
      setError("");

      const response = await recordSalvation(payload);

      await onSuccess?.(response);

      setSuccessMessage(
        response?.message || "Your response has been recorded."
      );
      setStep("success");
    } catch (err) {
      setError(err.message || "We could not save your response.");
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

  const normalizeSalvationDate = (dateValue) => {
    if (!dateValue) return null;

    return new Date(`${dateValue}T12:00:00`).toISOString();
  };

  const handleAlreadySavedSubmit = () => {
    handleRecordSalvation({
      salvationStatus: "already_saved",
      salvationDate: normalizeSalvationDate(date),
      salvationDateEstimated: isEstimated,
      salvationTestimony: testimony.trim(),
    });
  };

  const modalTitle =
    step === "already"
      ? "Tell Us About Your Salvation"
      : step === "success"
        ? "Your Response Has Been Recorded"
        : "Have You Made the Decision to Follow Jesus?";

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAndReset}
      title={modalTitle}
      size="md"
    >
      {step === "initial" && (
        <div className="salvation-modal__section">
          <p className="salvation-modal__text">
            Lord Jesus, I acknowledge that I am a sinner who needs your
            forgiveness. I believe that you died for my sins. I repent of my
            sins and want to leave them behind. I invite you to come into my
            life today. I trust you as my Savior, and I will follow you as my
            Lord. Write my name in the Book of Life and help me follow you all
            the days of my life. In Jesus&apos; name, amen.
          </p>

          {error ? (
            <p className="salvation-modal__error">{error}</p>
          ) : null}

          <div className="salvation-modal__actions">
            <button
              className="salvation-modal__confirm"
              type="button"
              onClick={handleSavedToday}
              disabled={loading}
            >
              {loading ? "Recording..." : "I Gave My Life to Jesus Today"}
            </button>

            <button
              className="salvation-modal__secondary"
              type="button"
              onClick={() => setStep("already")}
              disabled={loading}
            >
              I Was Already Saved
            </button>

            <button
              className="salvation-modal__secondary"
              type="button"
              onClick={handleExploring}
              disabled={loading}
            >
              I&apos;m Still Exploring Faith
            </button>
          </div>
        </div>
      )}

      {step === "already" && (
        <div className="salvation-modal__section">
          <label className="salvation-modal__label">
            Date <span>(optional)</span>
            <input
              className="salvation-modal__input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="salvation-modal__checkbox">
            <input
              type="checkbox"
              checked={isEstimated}
              onChange={(e) => setIsEstimated(e.target.checked)}
            />
            I don&apos;t remember the exact date
          </label>

          <label className="salvation-modal__label">
            Testimony <span>(optional)</span>
            <textarea
              className="salvation-modal__textarea"
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              placeholder="Share your story..."
            />
          </label>

          {error ? (
            <p className="salvation-modal__error">{error}</p>
          ) : null}

          <div className="salvation-modal__actions">
            <button
              className="salvation-modal__confirm"
              type="button"
              onClick={handleAlreadySavedSubmit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : initialStep === "already"
                  ? "Update Salvation Journey"
                  : "Save My Salvation"}
            </button>

            <button
              className="salvation-modal__secondary"
              type="button"
              onClick={() => {
                setStep("initial");
                setError("");
              }}
              disabled={loading}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="salvation-modal__success">
          <div
            className="salvation-modal__success-icon"
            aria-hidden="true"
          >
            Faith
          </div>

          <p className="salvation-modal__text">{successMessage}</p>

          <button
            className="salvation-modal__confirm"
            type="button"
            onClick={closeAndReset}
          >
            Continue
          </button>
        </div>
      )}
    </Modal>
  );
}