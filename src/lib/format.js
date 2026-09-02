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

export function splitArticleHtml(html, { minParts = 4 } = {}) {
  const source = String(html || "").trim();
  const parts = source
    .split(/(?<=<\/p>)/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < minParts) {
    return { before: source, after: "" };
  }

  const mid = Math.ceil(parts.length / 2);
  return {
    before: parts.slice(0, mid).join(""),
    after: parts.slice(mid).join(""),
  };
}
