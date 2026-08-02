import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

// gray-matter parses unquoted YAML dates (e.g. date: 2026-08-02) into
// real JS Date objects, not strings. React can't render a Date object
// directly, so always normalize to a plain "YYYY-MM-DD" string here,
// regardless of whether the source file quoted the date or not.
function normalizeDate(rawDate) {
  if (!rawDate) return "";
  if (rawDate instanceof Date) {
    return rawDate.toISOString().slice(0, 10);
  }
  return String(rawDate);
}

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: normalizeDate(data.date),
      category: data.category || "General",
      content,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, ${slug}.md);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: normalizeDate(data.date),
    category: data.category || "General",
    content,
  };
}
