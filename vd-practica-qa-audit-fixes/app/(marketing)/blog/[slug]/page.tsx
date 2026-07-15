import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ArticleHeader } from "@/components/sections/blog/article-header";
import { ArticleContent } from "@/components/sections/blog/article-content";
import { ArticleAuthorBox } from "@/components/sections/blog/article-author-box";
import { RelatedArticles } from "@/components/sections/blog/related-articles";
import { ArticleLeadGen } from "@/components/sections/blog/article-lead-gen";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, seoTitle: true, seoDesc: true, imageUrl: true }
  });

  if (!post) return { title: "Articol inexistent | VreauDigitalizare" };

  return {
    title: post.seoTitle || `${post.title} | Blog VreauDigitalizare`,
    description: post.seoDesc || post.excerpt || "Descoperă cele mai bune strategii de digitalizare pentru companii.",
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || "",
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    }
  };
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: {
        select: { name: true, role: true, image: true }
      }
    }
  });

  if (!post || !post.published) {
    notFound();
  }

  // Fetch related articles (same category, excluding current post, up to 3)
  let relatedPostsRaw: any[] = [];
  if (post.categoryId) {
    relatedPostsRaw = await prisma.post.findMany({
      where: {
        categoryId: post.categoryId,
        id: { not: post.id },
        published: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { category: true }
    });
  }

  const relatedPosts = relatedPostsRaw.map((rp) => ({
    slug: rp.slug,
    title: rp.title,
    coverImage: rp.imageUrl,
    category: rp.category?.name || "General",
    publishedAt: rp.createdAt,
  }));

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.imageUrl ? [post.imageUrl] : [],
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": [{
      "@type": "Person",
      "name": post.author?.name || "Echipa VreauDigitalizare"
    }]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="flex min-h-screen flex-col w-full bg-white pt-24 md:pt-32">
        <ArticleHeader
          title={post.title}
          category={post.category?.name || "General"}
          publishedAt={post.createdAt}
          readingTime={post.readingTime}
          author={{
            name: post.author?.name || "Echipa VreauDigitalizare",
            role: post.author?.role || "Autor VreauDigitalizare",
            image: post.author?.image || null
          }}
          coverImage={post.imageUrl}
        />

        <div className="py-12">
          <ArticleContent contentHtml={post.content} />
        </div>

        <ArticleAuthorBox 
          tags={post.tags || []}
          author={{
            name: post.author?.name || "Echipa VreauDigitalizare",
            role: post.author?.role || "Autor VreauDigitalizare",
            image: post.author?.image || null
          }}
        />

        {relatedPosts.length > 0 && (
          <RelatedArticles articles={relatedPosts} />
        )}

        <ArticleLeadGen />
      </main>
    </>
  );
}
