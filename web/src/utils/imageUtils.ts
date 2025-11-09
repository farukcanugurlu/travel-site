/**
 * Normalizes image URLs to be accessible from the frontend
 * If the URL starts with /uploads/, prepends the backend URL
 * Production'da dinamik olarak mevcut domain'i kullanır
 */
const getApiUrl = () => {
  // Browser'da çalışıyorsak, her zaman mevcut domain'i kullan
  // Bu sayede www ve non-www arasında sorun olmaz
  if (typeof window !== 'undefined' && window.location.hostname.includes('lexorholiday.com')) {
    // Mevcut domain'i kullan (www veya non-www fark etmez)
    return `${window.location.protocol}//${window.location.hostname}/api`;
  }
  
  // Environment variable varsa onu kullan (sadece development için)
  if (import.meta.env.VITE_API_URL && import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development için default
  return 'http://localhost:3000';
};

export function normalizeImageUrl(url?: string): string {
  if (!url) {
    return '/assets/img/listing/default-tour.jpg';
  }

  // If it's already a full URL (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it starts with /uploads/, prepend backend URL
  if (url.startsWith('/uploads/')) {
    const apiUrl = getApiUrl();
    return `${apiUrl}${url}`;
  }

  // Otherwise, assume it's a relative path from public assets
  return url;
}

