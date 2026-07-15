import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { revalidatePath } from "next/cache";

// GET /api/admin/posts
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(posts);
}

// POST /api/admin/posts
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { title, slug, content, excerpt, seoTitle, seoDesc, tags, imageUrl, published } = body;

  if (!title?.trim() || !slug?.trim()) {
    return new Response("Title and slug are required", { status: 400 });
  }
  if (!content?.trim()) {
    return new Response("Content cannot be empty", { status: 400 });
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return new Response("Slug already exists", { status: 409 });
  }

  if (!user.id) {
    return new Response("User ID not found", { status: 403 });
  }

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: excerpt?.trim() || null,
      seoTitle: seoTitle?.trim() || null,
      seoDesc: seoDesc?.trim() || null,
      tags: tags || [],
      imageUrl: imageUrl?.trim() || null,
      published: published ?? false,
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");

  return NextResponse.json(post, { status: 201 });
}
