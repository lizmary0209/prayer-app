import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { login } from "../../utils/api";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLoggedIn, onOpenRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setEmail("");
        setPassword("");
        setError("");
        setIsSubmitting(false);
    }, [isOpen]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await login({ email, password });

            localStorage.setItem("jwt", data.token);
            onLoggedIn?.(data.user);


            onClose();
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Sign In"
        size="sm"
        footer={
            <>
            <button
            className="btn btn--ghost"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            >
                Cancel
            </button>

            <button
            className="btn btn--primary"
            type="submit"
            form="login-form"
            disabled={isSubmitting}
            >
                {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
            </>
        }
        >
            <form id="login-form" className="auth" onSubmit={handleSubmit}>
                <label className="auth__label" htmlFor="login-email">
                    Email
                </label>
                <input 
                id="login-email"
                className="auth__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                />

                <label className="auth__label" htmlFor="login-password">
                    Password
                </label>
                <input
                id="login-password"
                className="auth__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                minLength={6}
                maxLength={50}
                required
                />

                {error && <p className="auth__error"></p>}

                {onOpenRegister && (
                    <button
                    type="button"
                    className="auth__link"
                    onClick={onOpenRegister}
                    disabled={isSubmitting}
                    >
                        Don't have an account? Register
                    </button>
                )}
            </form>
        </Modal>
    );
}