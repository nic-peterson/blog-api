const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4000';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed');
  }

  return payload;
}

export async function fetchPosts() {
  const { posts } = await requestJson('/posts');
  return posts;
}

export async function fetchPost(slug) {
  const { post } = await requestJson(`/posts/${slug}`);
  return post;
}

export async function createComment(slug, commentInput) {
  const { comment } = await requestJson(`/posts/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentInput)
  });
  return comment;
}
