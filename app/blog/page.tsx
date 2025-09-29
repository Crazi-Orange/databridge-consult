'use client';

import { useState, useEffect } from 'react';
import { fetchBlogPosts } from 'app/lib/api';
import { BlogPost } from 'app/types/database.types';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? `${err.message}${err.cause ? ` (Details: ${JSON.stringify(err.cause)})` : ''}` : 'Unknown error';
        setError(errorMessage);
        console.error('Failed to load blog posts:', err);
      }
    };
    loadPosts();
  }, []);

  if (error) {
    return <div>Error loading blog posts: {error}</div>;
  }

  return (
    <div>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <p>Category: {post.category}</p>
                {post.published_at && <p>Published: {new Date(post.published_at).toLocaleDateString()}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}