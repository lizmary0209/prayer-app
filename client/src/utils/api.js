const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function request(path, options = {}) {
    const token = localStorage.getItem("jwt");

    const res = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });
    

    const text = await res.text();
    let data;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        const msg = data?.message || `Request failed: ${res.status}`;
        throw new Error(msg);
    }

    return data;
}

export function signup(payload) {
    return request("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function login(payload) {
    return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function createPrayer(payload) {
    return request("/api/prayers", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function getMe() {
    return request("/api/users/me");
}