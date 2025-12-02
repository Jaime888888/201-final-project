// src/api/reviews.js

export async function getReviews(spotId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/spots/${spotId}/reviews`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reviews (${res.status})`);
  }

  return await res.json();
}

export async function createReview(spotId, payload) {
  // payload could be { rating, busyLevel, comment }
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create review (${res.status})`);
  }

  return await res.json();
}
