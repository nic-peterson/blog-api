import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteAdminComment,
  deleteAdminPost,
  getAdminPosts,
  setPostPublished
} from '../api.js';
import { clearToken } from '../auth.js';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Not published';
  }

  return new Date(dateValue).toLocaleString();
}

export function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function loadPosts() {
    try {
      setError('');
      const fetchedPosts = await getAdminPosts();
      setPosts(fetchedPosts);
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleTogglePublish(post) {
    await setPostPublished(post.id, !post.published);
    await loadPosts();
  }

  async function handleDeletePost(postId) {
    await deleteAdminPost(postId);
    await loadPosts();
  }

  async function handleDeleteComment(commentId) {
    await deleteAdminComment(commentId);
    await loadPosts();
  }

  function handleSignOut() {
    clearToken();
    navigate('/login');
  }

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <section>
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <Link className="button-link" to="/posts/new">
            New post
          </Link>
          <button onClick={handleSignOut} type="button">
            Sign out
          </button>
        </div>
      </header>

      {error ? <p className="error-message">{error}</p> : null}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="panel">
            <div className="dashboard-header">
              <h2>{post.title}</h2>
              <div className="header-actions">
                <Link className="button-link" to={`/posts/${post.id}/edit`}>
                  Edit
                </Link>
                <button onClick={() => handleTogglePublish(post)} type="button">
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => handleDeletePost(post.id)} type="button">
                  Delete
                </button>
              </div>
            </div>
            <p>
              Status: <strong>{post.published ? 'Published' : 'Draft'}</strong> ({formatDate(post.publishedAt)})
            </p>
            <p>{post.content.slice(0, 220)}...</p>

            <h3>Comments ({post.comments.length})</h3>
            {post.comments.length === 0 ? <p>No comments yet.</p> : null}
            <ul className="comment-list">
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <p>
                    <strong>{comment.authorName}</strong> ({new Date(comment.createdAt).toLocaleString()})
                  </p>
                  <p>{comment.content}</p>
                  <button type="button" onClick={() => handleDeleteComment(comment.id)}>
                    Delete comment
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
