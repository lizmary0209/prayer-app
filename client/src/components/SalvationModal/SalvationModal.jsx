import { useState } from "react";
import "./SalvationModal.css";
import { recordSalvation } from "../../utils/api";

export default function SalvationModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState("initial");
    const [date, setDate] = useState("");
    const [isEstimated, setIsEstimated] = useState(false);
    const [testimony, setTestimony] = useState("");
    const [loading, setLoading] = useState(false);


    if (!isOpen) return null;

    const handleSavedToday = async () => {
        try {
            setLoading(true);

            const res = await recordSalvation({
                salvationStatus: "saved_today",
            });

            onSuccess(res);
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExploring = async () => {
        try {
            setLoading(true);

            const res = await recordSalvation({
                salvationStatus: "exploring",
            });

            onSuccess(res);
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAlreadySavedSubmit = async () => {
        try {
            setLoading(true);

            const res = await recordSalvation({
                salvationStatus: "already_saved",
                salvationDate: date || null,
                salvationDateEstimated: isEstimated,
                salvationTestimony: testimony,
            });

            onSuccess(res);
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="salvation-modal" onClick={onClose}>
            <div 
            className="salvation-modal__content"
            onClick={(e) => e.stopPropagation()}
            >
                <button
                type="button"
                className="salvation-modal__close"
                onClick={onClose}
                >
                    ×
                </button>

                {step === "initial" && (
                    <>
                    <h2 className="salvation-modal__title">
                        Have you made the decision to follow Jesus?
                    </h2>

                    <p className="salvation-modal__text">
                        Lord Jesus, I acknowledge that I am a sinner who needs your forgiveness. I believe that you died for my sins. I repent of my sins and want to leave them behind. I invite you to come into my life today. I trust you as my Savior and I will follow you as my Lord. Write my name in the book of life and help me to follow you all the days of my life. In Jesus name, Amen.
                    </p>

                    <div className="salvation-modal__actions">
                    <button
                    className="salvation-modal__confirm"
                    onClick={handleSavedToday}
                    disabled={loading}
                    >
                        I Gave My Life to Jesus Today
                    </button>

                    <button
                    className="salvation-modal__secondary"
                    onClick={() => setStep("already")}
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

                    <label>Date (optional)</label>
                    <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />

                    <label>
                        <input 
                        type="checkbox"
                        checked={isEstimated}
                        onChange={(e) => setIsEstimated(e.target.checked)}
                        />
                        I don't remember the exact date
                    </label>

                    <label>Testimony (optional)</label>
                    <textarea
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
                        Save My Salvation
                    </button>

                    <button
                    className="salvation-modal__secondary"
                    onClick={() => setStep("initial")}
                    >
                        Back
                    </button>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}