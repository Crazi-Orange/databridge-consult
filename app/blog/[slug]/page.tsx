import { fetchBlogPost } from "app/lib/api";

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await fetchBlogPost(params.slug);    
    
    if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="text-sm text-gray-500">{post.category} — {new Date(post.created_at).toLocaleDateString()}</div>
      <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
