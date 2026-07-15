import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { ArrowRight, Calendar } from "lucide-react";

interface RelatedArticle {
  slug: string;
  title: string;
  coverImage: string | null;
  category: string;
  publishedAt: Date;
}

export function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
            Articole Similare
          </h2>
          <Link
            href="/blog"
            className="hidden sm:flex items-center text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            Vezi Toate Articolele <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-md bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-4 font-heading text-lg font-bold leading-snug tracking-tight text-slate-900 line-clamp-2">
                  {post.title}
                </h3>
                <div className="mt-auto flex items-center text-xs font-semibold text-slate-500">
                  <Calendar className="mr-1.5 size-3.5" />
                  {format(post.publishedAt, "d MMM yyyy", { locale: ro })}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-10 flex sm:hidden items-center justify-center text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Vezi Toate Articolele <ArrowRight className="ml-1.5 size-4" />
        </Link>
      </div>
    </section>
  );
}
