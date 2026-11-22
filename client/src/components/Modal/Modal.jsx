import { useEffect, useId, useRef } from "react";
import "./Modal.css";

export default function Modal({
    isOpen,
    onClose, 
    title,
    children,
    footer,
    size = "md",
}) {
    const titleId = useId();
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const modalElement = modalRef.current;

        const focusableSelector = [
            "button:not([disabled])", 
            "input:not([disabled])",
            "textarea:not([disabled])",
            "select:not([disabled])",
            'a[href]',
            '[tabindex]:not([tabindex="-1"])',
        ].join(",");

        const focusableElements = modalElement
        ? Array.from(modalElement.querySelectorAll(focusableSelector))
        : [];

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length -1];

        firstFocusable?.focus();

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key !== "Tab" || focusableElements.length === 0) return;

           if (e.shiftKey && document.activeElement === firstFocusable) {
  e.preventDefault();
  lastFocusable?.focus();
} else if (!e.shiftKey && document.activeElement === lastFocusable) {
  e.preventDefault();
  firstFocusable?.focus();
}
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.classList.add("no-scroll");

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove("no-scroll");
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div 
         className="modal" 
         role="dialog"
         aria-modal="true"
         aria-labelledby={title ? titleId : undefined}
          >
            <div 
            ref={modalRef}
            className={`modal__content modal__content--${size}`}
            >
                <div className="modal__header">
                    {title ? (
                        <h2 className="modal__title" id={titleId}>{title}</h2>
                    ) : <div />}
                   <button
                        className="modal__close"
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="modal__body">{children}</div>

                {footer ? ( 
                <div className="modal__footer">{footer}</div>
                ) : null}
            </div>
        </div>
    );
}
