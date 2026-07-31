import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://golfislife-sigma.vercel.app";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/blog",
    "/about",
    "/privacy-policy",
    "/affiliate-disclosure",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const posts = getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
  }));

  return [...staticRoutes, ...postRoutes];
}
