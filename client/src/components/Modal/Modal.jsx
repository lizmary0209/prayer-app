import { useEffect } from "react";
import "./Modal.css";

export default function Modal({
    isOpen,
    onClose, 
    title,
    children,
    footer,
    size = "md",
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        document.body.classList.add("no-scroll");

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.classList.remove("no-scroll");
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const stop = (e) => e.stopPropagation();

    return (
        <div className="modal" onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
         role="dialog"
          aria-modal="true"
          >
            <div 
            className={`modal__content modal__content--${size}`}
            onMouseDown={stop}
            >
                <div className="modal__header">
                    {title ? <h2 className="modal__title">{title}</h2> : <div />}
                    <button className="modal__close" type="button" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>

                <div className="modal__body">{children}</div>

                {footer ? <div className="modal__footer">{footer}</div> : null}
            </div>
        </div>
    );
}