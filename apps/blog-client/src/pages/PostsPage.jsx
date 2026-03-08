import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../api.js';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Draft';
  }

  return new Date(dateValue).toLocaleString();
}

export function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section>
      <h2>Published posts</h2>
      {posts.length === 0 ? <p>No published posts yet.</p> : null}
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id}>
            <h3>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="muted">Published {formatDate(post.publishedAt)}</p>
            <p>{post.content.slice(0, 180)}...</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
