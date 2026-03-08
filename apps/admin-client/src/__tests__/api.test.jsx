import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAdminPosts } from '../api.js';
import { setToken } from '../auth.js';

describe('admin API client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('adds bearer token for protected requests', async () => {
    setToken('jwt-token');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ posts: [] })
    });

    await getAdminPosts();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/posts'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token'
        })
      })
    );
  });

  it('throws when no token exists', async () => {
    await expect(getAdminPosts()).rejects.toThrow('Missing auth token');
  });
});
