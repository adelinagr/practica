"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface FormattedPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  author: string;
}



function PostCard({ post }: { post: FormattedPost }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-3 font-heading text-xl font-bold tracking-tight text-foreground line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-6 text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(post.publishedAt), "d MMM yyyy", { locale: ro })}
            </span>
            <span className="flex items-center gap-1.5 text-blue-500 font-semibold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Citește <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BlogGrid({ posts }: { posts: FormattedPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center bg-card/20">
        <h3 className="mb-2 text-xl font-semibold text-foreground">Nu există articole aici</h3>
        <p className="text-sm text-muted-foreground mb-6">Momentan nu există articole publicate pentru aceste filtre.</p>
        <Link href="/" className="text-sm font-bold text-blue-500 hover:text-blue-400 underline underline-offset-4">
          Înapoi la Home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
