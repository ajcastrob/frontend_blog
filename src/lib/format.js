export function formatDate(iso) {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(iso) {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function readingTime(html) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "1 min de lectura";

  const minutes = Math.max(1, Math.round(text.split(" ").length / 220));
  return `${minutes} min de lectura`;
}
