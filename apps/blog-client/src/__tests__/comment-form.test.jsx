import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CommentForm } from '../components/CommentForm.jsx';

afterEach(() => {
  cleanup();
});

describe('CommentForm', () => {
  it('shows an error when required fields are blank', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CommentForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /post comment/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/name and comment are required/i)).toBeInTheDocument();
  });

  it('submits trimmed payload values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<CommentForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^name/i), '  Alice  ');
    await user.type(screen.getByLabelText(/email/i), ' alice@example.com ');
    await user.type(screen.getByLabelText(/comment/i), '  Great post!  ');
    await user.click(screen.getByRole('button', { name: /post comment/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      authorName: 'Alice',
      authorEmail: 'alice@example.com',
      content: 'Great post!'
    });
  });
});
