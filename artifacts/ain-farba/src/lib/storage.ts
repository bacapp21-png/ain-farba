/**
 * Convert a stored image path to a displayable URL.
 * Cloudinary and external URLs are returned as-is.
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "";
  return path;
}
