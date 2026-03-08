import { useState } from 'react';

export function CommentForm({ onSubmit, submitting = false }) {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!authorName.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }

    setError('');

    await onSubmit({
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      content: content.trim()
    });

    setAuthorName('');
    setAuthorEmail('');
    setContent('');
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Leave a comment</h3>
      <label>
        Name
        <input
          name="authorName"
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
        />
      </label>
      <label>
        Email (optional)
        <input
          type="email"
          name="authorEmail"
          value={authorEmail}
          onChange={(event) => setAuthorEmail(event.target.value)}
        />
      </label>
      <label>
        Comment
        <textarea
          name="content"
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      {error ? <p className="error-message">{error}</p> : null}
      <button disabled={submitting} type="submit">
        {submitting ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
}
