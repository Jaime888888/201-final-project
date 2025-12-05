// frontend/src/api/auth.js
const BASE_URL = "https://studyspot.online/api";

async function request(method, uri, body) {
  const token = localStorage.getItem("authToken");
  const headers = {
    Accept: "application/json",
  };

  if (body != null) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${uri}`, {
    method,
    headers,
    credentials: "include",
    body: body != null ? JSON.stringify(body) : undefined,
  });

  // Handle no-content
  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // not JSON — keep as text
    data = text;
  }

  if (!res.ok) {
    const message = (data && data.message) || (typeof data === "string" && data) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * GET helper
 * @param {string} uri - relative URI (e.g. '/spots' or '/auth/me')
 * @returns parsed JSON response
 */
export async function GET(uri) {
  return request("GET", uri, null);
}

/**
 * POST helper
 * @param {string} uri - relative URI (e.g. '/auth/login')
 * @param {object} body - JS object to send as JSON body
 * @returns parsed JSON response
 */
export async function POST(uri, body) {
  return request("POST", uri, body);
}

export default { GET, POST };