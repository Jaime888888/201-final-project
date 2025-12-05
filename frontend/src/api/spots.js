// frontend/src/api/spots.js
import { GET, POST } from "./auth";

export async function getSpots() {
  return await GET("/spots");
}

export async function getSpotById(id) {
  if (!id) throw new Error("getSpotById requires an id");
  return await GET(`/spots/${id}`);
}

export async function createSpot(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("createSpot requires a payload object");
  }
  return await POST("/spots", payload);
}