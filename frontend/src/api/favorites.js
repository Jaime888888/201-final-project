// frontend/src/api/favorites.js
import { GET, POST } from "./auth";

/**
 * Get favorites for the current user.
 * Returns an array of favorite spot objects.
 */
export async function getFavorites() {
  const data = await GET("/favorites");
  return Array.isArray(data) ? data : (data?.favorites || []);
}

/**
 * Toggle favorite for a spot.
 * Sends { spotId, favorite } to backend and returns the server response.
 */
export async function toggleFavorite(spotId, favorite = true) {
  if (!spotId) throw new Error("toggleFavorite requires a spotId");
  return await POST("/favorites", { spotId, favorite });
}

export default { getFavorites, toggleFavorite };