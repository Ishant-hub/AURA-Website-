/**
 * Formats a Google User Content image URL to fetch the original, uncompressed
 * high-resolution (4K) version by appending `=s0`.
 */
export function get4KImageUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.jpg";
  
  if (url.includes("lh3.googleusercontent.com")) {
    // If the URL already has a suffix like =w... or =s..., strip it first
    const base = url.split("=")[0];
    return `${base}=s0`;
  }
  
  return url;
}
