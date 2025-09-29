'use client';

import { useState, useEffect } from 'react';
import { fetchBlogPost } from 'app/lib/api';
import { BlogPost } from 'app/types/database.types';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchBlogPost(slug);
        setPost(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? `${err.message}${err.cause ? ` (Details: ${JSON.stringify(err.cause)})` : ''}` : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to load blog post:', err);
      }
    };
    loadPost();
  }, [slug]);

  if (error) {
    return <div>Error loading blog post: {error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <p>{post.content}</p>
      <p>Category: {post.category}</p>
      {post.published_at && <p>Published: {new Date(post.published_at).toLocaleDateString()}</p>}
      <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
      {post.updated_at && <p>Updated: {new Date(post.updated_at).toLocaleDateString()}</p>}
    </div>
  );
}