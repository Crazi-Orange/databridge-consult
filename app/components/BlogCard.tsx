import { BlogPost } from 'app/types/database.types';

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p>{post.content.substring(0, 100)}...</p>
    </div>
  );
}
