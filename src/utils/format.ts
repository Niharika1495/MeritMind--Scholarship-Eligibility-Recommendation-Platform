/**
 * Shared formatting + date helpers.
 */

export const inr = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)}Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
      : `₹${Math.round(n / 1000)}K`;

export const daysLeft = (deadline: string) =>
  Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000));

export const deadlineTone = (deadline: string): "urgent" | "soon" | "calm" => {
  const d = daysLeft(deadline);
  if (d <= 7) return "urgent";
  if (d <= 21) return "soon";
  return "calm";
};

export const prettyDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const countdown = (deadline: string) => {
  const d = daysLeft(deadline);
  if (d === 0) return "Closes today";
  if (d === 1) return "1 day left";
  return `${d} days left`;
};

export const pct = (n: number) => `${Math.round(n)}%`;

export const ensureAbsoluteUrl = (url?: string) => {
  if (!url) return "https://scholarships.gov.in";
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return u;
  }
  return `https://${u}`;
};
