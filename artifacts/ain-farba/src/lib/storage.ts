/**
 * Convert a stored image path to a displayable URL.
 *
 * Images uploaded via the admin panel are stored as objectPaths like
 * `/objects/uploads/<uuid>`. To display them we proxy through the API server.
 * External URLs (http/https) are returned unchanged.
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "";
  // Already an absolute URL
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Object-storage path — proxy through the API
  if (path.startsWith("/objects/")) {
    return `/api/storage/objects${path.slice("/objects".length)}`;
  }
  return path;
}
