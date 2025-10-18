/**
 * API Configuration
 *
 * This file exports the API URLs based on environment variables.
 * Make sure to set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SOCKET_URL in your .env files
 */

// Get API URL from environment variable, fallback to localhost for development
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Get Socket URL from environment variable, fallback to localhost for development
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

// Export backend URL for backward compatibility
export const BACKEND_URL = API_URL;

export default {
  API_URL,
  SOCKET_URL,
  BACKEND_URL,
};
