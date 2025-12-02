// src/api/spots.js

export async function getSpots() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/spots", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch spots (${res.status})`);
  }

  return await res.json();
}

export async function getSpotById(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/spots/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch spot (${res.status})`);
  }

  return await res.json();
}

export async function createSpot(payload) {
  // payload is your new spot data
  const token = localStorage.getItem("token");

  const res = await fetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create spot (${res.status})`);
  }

  return await res.json();
}
