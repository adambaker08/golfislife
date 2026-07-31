import { getAllPosts, getPostBySlug } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return { title: `${post.title} — GolfisLife`, description: post.description };
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article>
      <p className="text-sm text-gray-500 mb-1">
        {post.date} · {post.category}
      </p>
      <h1 className="text-3xl font-extrabold text-fairwayDark mb-6">
        {post.title}
      </h1>
      <div className="prose-golf">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
