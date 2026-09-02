import { getPagePreview, imageUrl } from "@/lib/wagtail.js";
import { splitArticleHtml } from "@/lib/format.js";

function unwrap(value) {
  return String(value || "")
    .replace(/^[«“"‘']+|[»”"’']+$/g, "")
    .trim();
}

function fillCover(post) {
  const src = imageUrl(post.image);
  if (!src) return;

  const img = document.querySelector("#preview-image");
  const media = document.querySelector("#preview-media");
  img.src = src;
  img.alt = post.image?.title || post.caption || post.title || "";
  media.hidden = false;
}

function showQuote(figureId, textId, quote) {
  document.querySelector(textId).textContent = `“${quote}”`;
  document.querySelector(figureId).hidden = false;
}

function fillQuote(quote, after) {
  if (!quote) return;
  if (after) {
    showQuote("#preview-quote-mid", "#preview-quote-mid-text", quote);
    return;
  }
  showQuote("#preview-quote-early", "#preview-quote-early-text", quote);
}

function fillBody(post) {
  const quote = unwrap(post.quote);
  const { before, after } = quote
    ? splitArticleHtml(post.body ?? "")
    : { before: post.body ?? "", after: "" };

  document.querySelector("#preview-before").innerHTML = before;
  document.querySelector("#preview-after").innerHTML = after;
  fillQuote(quote, after);
}

export async function renderPreview() {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const contentType = params.get("content_type");
  const status = document.querySelector("#preview-status");

  if (!token || !contentType) {
    status.textContent = "Falta token o content_type";
    return;
  }

  try {
    const post = await getPagePreview(contentType, token);
    status.remove();
    document.querySelector("#preview-title").textContent = post.title ?? "";
    document.querySelector("#preview-intro").textContent = post.intro ?? "";
    fillCover(post);
    fillBody(post);
  } catch (err) {
    status.textContent = err.message;
  }
}
