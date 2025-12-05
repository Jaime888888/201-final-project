// frontend/src/api/reviews.js
import { GET, POST } from "./auth";

/**
 * Get reviews for a spot
 */
export async function getReviews(spotId) {
  if (!spotId) throw new Error("getReviews requires a spotId");
  return await GET(`/spots/${spotId}/reviews`);
}

/**
 * Create a review for a spot
 * payload example: { rating: 4, busyLevel: "low", comment: "Nice spot" }
 */
export async function createReview(spotId, payload) {
  if (!spotId) throw new Error("createReview requires a spotId");
  if (!payload || typeof payload !== "object") {
    throw new Error("createReview requires a payload object");
  }
  return await POST(`/spots/${spotId}/reviews`, payload);
}

export default { getReviews, createReview };