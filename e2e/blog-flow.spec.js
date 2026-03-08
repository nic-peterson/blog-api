import { expect, test } from '@playwright/test';

const adminUrl = 'http://127.0.0.1:4174';
const blogUrl = 'http://127.0.0.1:4173';

async function adminLogin(page) {
  await page.goto(`${adminUrl}/login`);
  await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL ?? 'admin@example.com');
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD ?? 'admin12345');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
}

async function createPost(page, title, content) {
  await page.getByRole('link', { name: 'New post' }).click();
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Content').fill(content);
  await page.getByRole('button', { name: 'Save post' }).click();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
}

test('unauthorized admin access redirects to login', async ({ page }) => {
  await page.goto(`${adminUrl}/`);

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
});

test('admin can create, publish, and expose a post to the public app', async ({ page }) => {
  const title = `Playwright Post ${Date.now()}`;

  await adminLogin(page);
  await createPost(page, title, 'Draft body for end-to-end verification.');

  const postPanel = page.locator('.panel').filter({ hasText: title });
  await expect(postPanel.getByText('Status:')).toContainText('Draft');
  await postPanel.getByRole('button', { name: 'Publish' }).click();
  await expect(postPanel.getByText('Status:')).toContainText('Published');

  await page.goto(blogUrl);
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});

test('public user can comment and admin can delete that comment', async ({ page, context }) => {
  const title = `Comment Flow ${Date.now()}`;
  const commentText = `Comment text ${Date.now()}`;

  await adminLogin(page);
  await createPost(page, title, 'Published post content for comment moderation flow.');

  const postPanel = page.locator('.panel').filter({ hasText: title });
  await postPanel.getByRole('button', { name: 'Publish' }).click();

  const publicPage = await context.newPage();
  await publicPage.goto(blogUrl);
  await publicPage.getByRole('link', { name: title }).click();
  await publicPage.getByLabel('Name').fill('Public Tester');
  await publicPage.getByLabel('Comment').fill(commentText);
  await publicPage.getByRole('button', { name: 'Post comment' }).click();
  await expect(publicPage.getByText(commentText)).toBeVisible();

  await page.goto(adminUrl);
  const refreshedPanel = page.locator('.panel').filter({ hasText: title });
  await expect(refreshedPanel.getByText(commentText)).toBeVisible();
  await refreshedPanel.getByRole('button', { name: 'Delete comment' }).first().click();
  await expect(refreshedPanel.getByText(commentText)).not.toBeVisible();
});
