"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  author: string;
}

export function FeaturedArticle({ post }: { post: FeaturedPost | null }) {
  if (!post) return null;

  return (
    <div className="mb-16">
      <Link href={`/blog/${post.slug}`} className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-border/50 bg-card/40 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30">
        
        {/* Left Side: Image */}
        <div className="relative w-full md:w-3/5 h-64 md:h-[400px] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:bg-gradient-to-r" />
          
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex w-full md:w-2/5 flex-col justify-center p-8 md:p-10">
          <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl line-clamp-3">
            {post.title}
          </h2>
          <p className="mb-6 text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.publishedAt), "d MMM yyyy", { locale: ro })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} min cite
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/40">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {post.author.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground">{post.author}</span>
              </div>
              <span className="inline-flex items-center text-sm font-bold text-blue-500 transition-colors group-hover:text-blue-400">
                Citește <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
