import { fetchBlogPosts } from "app/lib/api";
import BlogCard from "../components/BlogCard";

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
