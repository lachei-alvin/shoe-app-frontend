// src/utils/api.js

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Generic API fetching utility (for public endpoints).
 */
export const fetchData = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");

    // --- 1. HANDLE NON-JSON RESPONSE ---
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();

      // If the response is OK but not JSON (e.g., an empty response or an issue in FastAPI),
      // and the path is expected to return a list (like /products or /categories), return an empty array.
      if (response.ok && (path === "/products" || path === "/categories")) {
        console.warn(
          `[WARN] Received non-JSON response for ${path}, returning empty list.`
        );
        return [];
      }

      throw new Error(
        `API returned unexpected content type (${
          contentType || "none"
        }) for ${path}. Full content: ${text.substring(0, 100)}...`
      );
    }

    const data = await response.json();

    // --- 2. HANDLE JSON ERROR RESPONSE ---
    if (!response.ok) {
      console.error("API Error:", data);
      const detail = data.detail
        ? typeof data.detail === "string"
          ? data.detail
          : data.detail[0]?.msg || "Unknown API Error"
        : response.statusText;
      throw new Error(detail);
    }
    return data;
  } catch (error) {
    console.error(`Fetch Error for ${path}:`, error);
    // For product/category routes, return empty array on network failure
    if (path === "/products" || path === "/categories") {
      return [];
    }
    return null;
  }
};

/**
 * Handles "authenticated" API calls using the mock system.
 * This is an unsecured wrapper around fetchData.
 */
// The mockToken parameter is kept in the signature here to match the call site in App.jsx,
// but it is ignored and not used for authentication.
export const authenticatedFetch = async (path, mockToken, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    // Authorization header is explicitly omitted for unsecure mock access
    ...options.headers,
  };

  // Use fetchData which handles the full URL construction and error handling
  const data = await fetchData(path, { ...options, headers });

  return data;
};

/**
 * Checks if the FastAPI server is running and reachable.
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
