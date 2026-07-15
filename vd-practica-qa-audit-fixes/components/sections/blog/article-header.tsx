import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { ArrowLeft, Clock, Calendar, Linkedin, Twitter, Link2 } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  category: string;
  publishedAt: Date;
  readingTime: number;
  author: {
    name: string;
    role: string | null;
    image: string | null;
  };
  coverImage: string | null;
}

export function ArticleHeader({
  title,
  category,
  publishedAt,
  readingTime,
  author,
}: ArticleHeaderProps) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-slate-900">{category}</span>
        </nav>

        {/* Metadata */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            {category}
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="size-4" />
            {format(publishedAt, "d MMM yyyy", { locale: ro })}
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Clock className="size-4" />
            {readingTime} min. lectură
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-8 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1]">
          {title}
        </h1>

        {/* Author & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-4">
            {author.image ? (
              <Image
                src={author.image}
                alt={author.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-600">
                {author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900">{author.name}</p>
              {author.role && (
                <p className="text-sm text-slate-500">{author.role}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
            <span>Distribuie:</span>
            <div className="flex items-center gap-2">
              <button className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                <Linkedin className="size-4" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                <Twitter className="size-4" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <Link2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
