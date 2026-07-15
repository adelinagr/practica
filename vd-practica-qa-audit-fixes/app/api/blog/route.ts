import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    const skip = (page - 1) * limit;

    const whereClause: any = {
      published: true,
    };

    if (category) {
      whereClause.category = {
        slug: category
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: {
          category: true,
          author: {
            select: { name: true, image: true, role: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    // Format for frontend
    const formattedPosts = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      coverImage: post.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      category: post.category?.name || "General",
      publishedAt: post.createdAt.toISOString(),
      readingTime: post.readingTime,
      author: post.author?.name || "Echipa VreauDigitalizare",
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      }
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
