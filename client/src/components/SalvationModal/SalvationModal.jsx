import { useEffect, useState } from "react";
import "./SalvationModal.css";
import { recordSalvation } from "../../utils/api";

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
    return;
  }

  setStep("initial");
  setDate("");
  setIsEstimated(false);
  setTestimony("");
  setLoading(false);
  setSuccessMessage("");
}, [isOpen, initialStep, initialData]);

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

  const normalizeSalvationDate = (dateValue) => {
    if (!dateValue) return null;

    return new Date(`${dateValue}T12:00:00`).toISOString();
  };

  const handleAlreadySavedSubmit = () => {
    handleRecordSalvation({
      salvationStatus: "already_saved",
      salvationDate: normalizeSalvationDate(date),
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
          x
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
                {loading
                 ? "Saving..."
                  : initialStep === "already"
                  ? "Update Salvation Journey"
                  : "Save My Salvation"}
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
            <p className="salvation-modal__success-icon">Faith</p>

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
