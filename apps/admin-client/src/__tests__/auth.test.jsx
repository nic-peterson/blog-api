import { beforeEach, describe, expect, it } from 'vitest';
import { clearToken, getToken, isAuthenticated, setToken } from '../auth.js';

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves auth token', () => {
    setToken('abc123');
    expect(getToken()).toBe('abc123');
    expect(isAuthenticated()).toBe(true);
  });

  it('clears token', () => {
    setToken('abc123');
    clearToken();

    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
