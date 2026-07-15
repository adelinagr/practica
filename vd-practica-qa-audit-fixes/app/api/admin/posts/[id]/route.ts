import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// GET /api/admin/posts/[id] — get single post with content
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });
  if (!post) return new Response("Not found", { status: 404 });

  return NextResponse.json(post);
}

// PATCH /api/admin/posts/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { title, slug, content, excerpt, seoTitle, seoDesc, tags, imageUrl, published } = body;

  // Check slug uniqueness if changing slug
  if (slug) {
    const existing = await prisma.post.findFirst({
      where: { slug, NOT: { id: params.id } },
    });
    if (existing)
      return new Response("Slug already in use", { status: 409 });
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(slug !== undefined && { slug: slug.trim() }),
      ...(content !== undefined && { content }),
      ...(excerpt !== undefined && { excerpt: excerpt?.trim() || null }),
      ...(seoTitle !== undefined && { seoTitle: seoTitle?.trim() || null }),
      ...(seoDesc !== undefined && { seoDesc: seoDesc?.trim() || null }),
      ...(tags !== undefined && { tags: tags || [] }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
      ...(published !== undefined && { published }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      seoTitle: true,
      seoDesc: true,
      tags: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");

  return NextResponse.json(post);
}

// DELETE /api/admin/posts/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  await prisma.post.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
