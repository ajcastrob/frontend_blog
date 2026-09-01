const MIN_CHARS = 48;
const MAX_CHARS = 180;
const IDEAL_CHARS = 110;
const MIN_WORDS = 8;

function stripHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function unwrapQuotes(value) {
  return String(value || "")
    .replace(/^[«“"‘']+|[»”"’']+$/g, "")
    .trim();
}

function normalize(value) {
  return unwrapQuotes(value).toLowerCase();
}

function quotedPhrases(text) {
  const phrases = [];
  const pattern = /[«“"]([^«»”“"]{20,240})[»”"]/g;

  for (const match of text.matchAll(pattern)) {
    phrases.push(unwrapQuotes(match[1]));
  }

  return phrases;
}

function sentences(text) {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((part) =>
      unwrapQuotes(part)
        .replace(/^[—–-]\s*/, "")
        .trim(),
    )
    .filter(Boolean);
}

function isCandidate(value, titleNorm) {
  if (value.length < MIN_CHARS || value.length > MAX_CHARS) return false;
  if (value.split(/\s+/).length < MIN_WORDS) return false;
  if (titleNorm && value.toLowerCase().includes(titleNorm.slice(0, 28))) return false;
  return true;
}

function scoreCandidate(value, index, total, fromQuote) {
  const lengthScore = 40 - Math.min(40, Math.abs(value.length - IDEAL_CHARS) / 3);
  const quoteBonus = fromQuote ? 36 : 0;
  const position = total <= 1 ? 0.5 : index / (total - 1);
  const middleScore = 18 - Math.abs(position - 0.45) * 36;

  return quoteBonus + lengthScore + middleScore;
}

export function pickPullQuote(html, { title = "" } = {}) {
  const text = stripHtml(html);
  if (!text) return "";

  const titleNorm = normalize(title);
  const quoted = quotedPhrases(text).filter((value) => isCandidate(value, titleNorm));
  const fromSentences = sentences(text).filter((value) => isCandidate(value, titleNorm));
  const pool = quoted.length > 0 ? quoted : fromSentences;

  if (pool.length === 0) return "";

  return pool
    .map((value, index) => ({
      value,
      score: scoreCandidate(value, index, pool.length, quoted.includes(value)),
    }))
    .sort((a, b) => b.score - a.score)[0].value;
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
