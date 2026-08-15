const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function request(path, options = {}) {
  const token = localStorage.getItem("jwt");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.method !== "GET" && { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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

export function updatePrayer(id, payload) {
  return request(`/api/prayers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return request("/api/users/me", {
    method: "GET",
  });
}

export function updateMe(payload) {
  return request("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getMyPrayers() {
  return request("/api/users/me/prayers", {
    method: "GET",
  });
}

export function recordSalvation(payload) {
  return request("/api/users/me/salvation", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getSalvationCount() {
  return request("/api/salvation/count", {
    method: "GET",
  });
}

export function toggleSavePrayer(id) {
  return request(`/api/prayers/${id}/save`, {
    method: "POST",
  });
}

export function getAdminStats() {
  return request("/api/admin/stats", {
    method: "GET",
  });
}

export function getRecentAdminPrayers() {
  return request("/api/admin/recent-prayers", {
    method: "GET",
  });
}

export function getAdminUsers() {
  return request("/api/admin/users", {
    method: "GET",
  });
}

export function getAwaitingAdminPrayers() {
  return request("/api/admin/awaiting-prayer", {
    method: "GET",
  });
}

export function deleteAdminPrayer(prayerId) {
  return request(`/api/admin/prayers/${prayerId}`, {
    method: "DELETE",
  });
}



