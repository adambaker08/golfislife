import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Blog — GolfisLife" };

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-fairwayDark mb-6">
        All posts
      </h1>
      {posts.length === 0 ? (
        <p className="text-gray-600">Nothing published yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-sand pb-6">
              <a href={`/blog/${post.slug}`} className="group">
                <h2 className="text-xl font-semibold text-fairwayDark group-hover:underline">
                  {post.title}
                </h2>
              </a>
              <p className="text-sm text-gray-500 mb-1">
                {post.date} · {post.category}
              </p>
              <p className="text-gray-700">{post.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
