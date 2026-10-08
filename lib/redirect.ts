const INTERNAL_BASE_URL = "https://highlandclinic.invalid";

export function getSafeRedirectPath(candidate: string | null): string {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return "/";
  }

  try {
    const destination = new URL(candidate, INTERNAL_BASE_URL);
    if (destination.origin !== INTERNAL_BASE_URL) return "/";
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}
