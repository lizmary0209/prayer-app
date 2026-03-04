import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { signup } from "../../utils/api";
import "./RegisterModal.css";

export default function RegisterModal({
    isOpen, 
    onClose,
    onRegistered,
    onOpenLogin,
}) {
    const [displayName, setDisplayName] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        setDisplayName("");
        setProfilePic("");
        setEmail("");
        setPassword("");
        setError("");
        setIsSubmitting(false);
    }, [isOpen]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!displayName.trim() || !email.trim() || !password.trim()) {
            setError("Display name, email, and password are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await signup({
                displayName: displayName.trim(),
                email: email.trim(),
                password,
                profilePic: profilePic.trim(),
            });

            localStorage.setItem("jwt", data.token);
            onRegistered?.(data.user);

        } catch (err) {
            setError(err.message || "Registration failed.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Register"
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
            form="register-form"
            disabled={isSubmitting}
            >
                {isSubmitting ? "Creating..." : "Register"}
            </button>
            </>
        }
        >
            <form id="register-form" className="auth" onSubmit={handleSubmit}>
                <label className="auth__label" htmlFor="reg-name">
                    Display Name
                </label>
                <input
                id="reg-name"
                className="auth__input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                minLength={2}
                maxLength={30}
                required
                />

                <label className="auth__label" htmlFor="reg-email">
                    Email
                </label>
                <input
                id="reg-email"
                className="auth__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                />

                <label className="auth__label" htmlFor="reg-password">
                    Password
                </label>
                <input
                id="reg-password"
                className="auth__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                maxLength={50}
                required
                />

                <label className="auth__label" htmlFor="reg-avatar">
                    Profile Picture URL (optional)
                </label>
                <input
                id="reg-avatar"
                className="auth__input"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                placeholder="https://..."
                />

                {error && <p className="auth__error">{error}</p>}

                <button
                type="button"
                className="auth__link"
                onClick={onOpenLogin}
                disabled={isSubmitting}
                >
                    Already have an account? Sign In
                </button>
            </form>
        </Modal>
    );
}