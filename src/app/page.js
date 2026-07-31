import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div>
      <section className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-fairwayDark mb-3">
          Golf gear, travel & courses — no fluff.
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Reviews, guides, and recommendations from someone who actually
          plays. New posts twice a day covering the clubs worth buying, the
          courses worth the green fee, and the trips worth planning.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-fairwayDark">
          Latest posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">
            No posts yet — check back soon, the first ones are on the way.
          </p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-sand pb-6">
                <a href={`/blog/${post.slug}`} className="group">
                  <h3 className="text-xl font-semibold text-fairwayDark group-hover:underline">
                    {post.title}
                  </h3>
                </a>
                <p className="text-sm text-gray-500 mb-1">
                  {post.date} · {post.category}
                </p>
                <p className="text-gray-700">{post.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
