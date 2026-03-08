import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAdminPost, getAdminPosts, updateAdminPost } from '../api.js';

export function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    getAdminPosts()
      .then((posts) => {
        const currentPost = posts.find((post) => String(post.id) === id);
        if (!currentPost) {
          throw new Error('Post not found');
        }

        setTitle(currentPost.title);
        setContent(currentPost.content);
        setPublished(currentPost.published);
      })
      .catch((caughtError) => setError(caughtError.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await updateAdminPost(id, { title, content, published });
      } else {
        await createAdminPost({ title, content, published });
      }

      navigate('/');
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading editor...</p>;
  }

  return (
    <section className="panel">
      <p>
        <Link to="/">Back to dashboard</Link>
      </p>
      <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label>
          Content
          <textarea
            rows={12}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
          Publish now
        </label>
        {error ? <p className="error-message">{error}</p> : null}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save post'}
        </button>
      </form>
    </section>
  );
}
