import { Metadata } from "next";
import { BlogHero } from "@/components/sections/blog/blog-hero";
import { FeaturedArticle } from "@/components/sections/blog/featured-article";
import { BlogGrid } from "@/components/sections/blog/blog-grid";
import { BlogSidebar } from "@/components/sections/blog/blog-sidebar";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cele mai recente insights digitale | Blog VreauDigitalizare",
  description: "Ghiduri practice, studii de caz și strategii pentru companii care vor să crească prin digitalizare, automatizare business și implementare cloud.",
  alternates: {
    canonical: "https://vreaudigitalizare.eu/blog",
  },
  openGraph: {
    title: "Blog & Insights | VreauDigitalizare",
    description: "Ghiduri practice și strategii de digitalizare pentru IMM-urile din România.",
    url: "https://vreaudigitalizare.eu/blog",
    type: "website",
  }
};

// Data fetching helper (Server-side)
async function getBlogData(searchParams: { page?: string; category?: string; search?: string }) {
  const page = parseInt(searchParams.page || "1");
  const limit = 6;
  const skip = (page - 1) * limit;

  const whereClause: any = { published: true };
  if (searchParams.category) {
    whereClause.category = { slug: searchParams.category };
  }
  if (searchParams.search) {
    whereClause.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { excerpt: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Fetch Featured Post
  const featuredPostRaw = await prisma.post.findFirst({
    where: { published: true, featured: true },
    include: { category: true, author: { select: { name: true, image: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Fetch paginated posts
  const [postsRaw, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      include: { category: true, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where: whereClause }),
  ]);

  // Fetch categories for sidebar
  const categoriesRaw = await prisma.category.findMany({
    orderBy: { articleCount: "desc" },
  });

  // Format data
  const formatPost = (p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    coverImage: p.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: p.category?.name || "General",
    publishedAt: p.createdAt.toISOString(),
    readingTime: p.readingTime,
    author: p.author?.name || "Echipa",
  });

  return {
    featuredPost: featuredPostRaw ? formatPost(featuredPostRaw) : null,
    posts: postsRaw.map(formatPost),
    categories: categoriesRaw.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      articleCount: c.articleCount
    })),
    pagination: {
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; search?: string };
}) {
  const data = await getBlogData(searchParams);

  // JSON-LD Generation
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog & Insights | VreauDigitalizare",
    "description": "Ghiduri practice pentru digitalizarea IMM-urilor.",
    "publisher": {
      "@type": "Organization",
      "name": "VreauDigitalizare"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex min-h-screen flex-col w-full">
        <BlogHero />
        
        <div className="bg-background py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            
            {/* ── Featured Post ── */}
            {(!searchParams.page || searchParams.page === "1") && !searchParams.search && !searchParams.category && (
              <FeaturedArticle post={data.featuredPost} />
            )}

            <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
              
              {/* ── Main Content Grid ── */}
              <div>
                <BlogGrid posts={data.posts} />
                
                {/* ── Pagination ── */}
                {data.pagination.pages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    {data.pagination.currentPage > 1 && (
                      <Link
                        href={`/blog?page=${data.pagination.currentPage - 1}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                        className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        Înapoi
                      </Link>
                    )}
                    <span className="text-sm font-medium text-muted-foreground">
                      Pagina {data.pagination.currentPage} din {data.pagination.pages}
                    </span>
                    {data.pagination.currentPage < data.pagination.pages && (
                      <Link
                        href={`/blog?page=${data.pagination.currentPage + 1}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                        className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        Următoarea
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* ── Sidebar ── */}
              <div>
                <BlogSidebar categories={data.categories} />
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
