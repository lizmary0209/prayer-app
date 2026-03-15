import "./SalvationModal.css";

export default function SalvationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

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
                aria-label="Close salvation prayer modal"
                >
                    ×
                </button>

                <h2 className="salvation-modal__title">Prayer of Salvation</h2>

                <p className="salvation-modal__text">
                    Lord Jesus, I acknowledge that I am a sinner who needs your forgiveness. I believe that you died for my sins. I repent of my sins and want to leave them behind. I invite you to come into my life today. I trust you as my Savior and I will follow you as my Lord. Write my name in the book of life and help me to follow you all the days of my life. In Jesus name, Amen.
                </p>

                <button
                type="button"
                className="salvation-modal__confirm"
                onClick={onConfirm}
                >
                    I Gave My Life to Jesus Today
                </button>
            </div>
        </div>
    );
}