import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createComment, fetchPost } from '../api.js';
import { CommentForm } from '../components/CommentForm.jsx';

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleString();
}

export function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPost(slug)
      .then(setPost)
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleCreateComment(formData) {
    try {
      setSubmitting(true);
      await createComment(slug, formData);
      const updatedPost = await fetchPost(slug);
      setPost(updatedPost);
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!post) {
    return <p className="error-message">Post unavailable.</p>;
  }

  return (
    <article>
      <p>
        <Link to="/">Back to posts</Link>
      </p>
      <h2>{post.title}</h2>
      <p className="muted">Published {formatDate(post.publishedAt)}</p>
      <p className="post-content">{post.content}</p>

      <section>
        <h3>Comments</h3>
        {post.comments?.length ? (
          <ul className="comment-list">
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <p>
                  <strong>{comment.authorName}</strong>{' '}
                  <span className="muted">{formatDate(comment.createdAt)}</span>
                </p>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </section>

      <CommentForm onSubmit={handleCreateComment} submitting={submitting} />
    </article>
  );
}
