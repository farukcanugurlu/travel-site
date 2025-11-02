/**
 * Normalizes image URLs to be accessible from the frontend
 * If the URL starts with /uploads/, prepends the backend URL
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function normalizeImageUrl(url?: string): string {
  if (!url) {
    return '/assets/img/listing/default-tour.jpg';
  }

  // If it's already a full URL (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it starts with /uploads/, prepend backend URL from env
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }

  // Otherwise, assume it's a relative path from public assets
  return url;
}

