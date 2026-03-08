export function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function buildUniqueSlugForPost(prisma, title, excludePostId) {
  const baseSlug = toSlug(title) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existingPost = await prisma.post.findFirst({
      where: {
        slug: candidate,
        ...(excludePostId ? { id: { not: excludePostId } } : {})
      },
      select: { id: true }
    });

    if (!existingPost) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
