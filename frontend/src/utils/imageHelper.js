/**
 * Image utility functions
 */

/**
 * Get public URL for uploaded image
 * Convert storage key to full URL
 * @param {string} key - Storage key (e.g., "foto-barang/123-file.jpg")
 * @returns {string} Full public URL
 */
export const getImageUrl = (key) => {
  if (!key) return null;
  
  // If already a full URL (http/https), return as is
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key;
  }
  
  // Get base URL from environment or use default
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  // Convert key to full URL: http://localhost:3000/uploads/foto-barang/123-file.jpg
  return `${baseUrl}/uploads/${key}`;
};

/**
 * Get image URL with fallback
 * @param {Object} image - Image object with url_gambar property
 * @param {string} fallback - Fallback URL if image is null
 * @returns {string} Image URL or fallback
 */
export const getImageUrlWithFallback = (image, fallback = 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia') => {
  if (!image || !image.url_gambar) return fallback;
  return getImageUrl(image.url_gambar);
};

/**
 * Get first image from array
 * @param {Array} images - Array of image objects
 * @returns {string|null} First image URL or null
 */
export const getFirstImageUrl = (images) => {
  if (!images || images.length === 0) return null;
  return getImageUrl(images[0].url_gambar);
};
