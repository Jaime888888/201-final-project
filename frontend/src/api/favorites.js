// src/api/favorites.js

export async function getFavorites() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/favorites", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch favorites (${res.status})`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data?.favorites || []);
}
