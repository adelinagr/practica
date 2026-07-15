import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const featuredPost = await prisma.post.findFirst({
      where: {
        published: true,
        featured: true,
      },
      include: {
        category: true,
        author: {
          select: { name: true, image: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    if (!featuredPost) {
      return NextResponse.json({ post: null });
    }

    const formattedPost = {
      slug: featuredPost.slug,
      title: featuredPost.title,
      excerpt: featuredPost.excerpt || "",
      coverImage: featuredPost.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      category: featuredPost.category?.name || "General",
      publishedAt: featuredPost.createdAt.toISOString(),
      readingTime: featuredPost.readingTime,
      author: featuredPost.author?.name || "Echipa VreauDigitalizare",
    };

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error("Error fetching featured post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
