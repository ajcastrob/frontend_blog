const url_base = import.meta.env.PUBLIC_WAGTAIL_API;

export const getBlogPost = async () => {
  try {
    const res = await fetch(
      `${url_base}/pages/?type=cms.ArticlePage&fields=*&order=-first_published_at`,
    );

    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status}`);
    }

    const json = await res.json();
    return json.items;
  } catch (error) {
    console.error("Error al traer posts de Wagtail", error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug) => {
  const posts = await getBlogPost();
  return posts.find((item) => item.meta.slug === slug) ?? null;
};

export const imageUrl = (image) => {
  const path = image?.url;
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;

  try {
    const origin = url_base ? new URL(url_base).origin : "http://127.0.0.1:8000";
    return `${origin}${path}`;
  } catch {
    return `http://127.0.0.1:8000${path}`;
  }
};
