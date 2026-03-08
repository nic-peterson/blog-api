import { getToken } from './auth.js';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4000';

async function requestJson(path, options = {}, authRequired = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {})
  };

  if (authRequired) {
    const token = getToken();
    if (!token) {
      throw new Error('Missing auth token');
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed');
  }

  return payload;
}

export async function loginAdmin(credentials) {
  return requestJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function getAdminPosts() {
  const { posts } = await requestJson('/admin/posts', {}, true);
  return posts;
}

export async function createAdminPost(postInput) {
  const { post } = await requestJson('/admin/posts', {
    method: 'POST',
    body: JSON.stringify(postInput)
  }, true);

  return post;
}

export async function updateAdminPost(postId, postInput) {
  const { post } = await requestJson(`/admin/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postInput)
  }, true);

  return post;
}

export async function setPostPublished(postId, published) {
  const { post } = await requestJson(`/admin/posts/${postId}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ published })
  }, true);

  return post;
}

export async function deleteAdminPost(postId) {
  await requestJson(
    `/admin/posts/${postId}`,
    {
      method: 'DELETE'
    },
    true
  );
}

export async function deleteAdminComment(commentId) {
  await requestJson(
    `/admin/comments/${commentId}`,
    {
      method: 'DELETE'
    },
    true
  );
}
