"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

interface BlogPreviewProps {
  posts: {
    title: string;
    category: string;
    excerpt: string;
    readTime: string;
    href: string;
    date: string;
    imageUrl?: string | null;
  }[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="py-24 bg-transparent border-t border-white/10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Ultimele resurse
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-sans font-light">
              Articole, ghiduri și studii de caz despre cum să îți crești afacerea folosind tehnologia.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold font-mono text-primary hover:text-foreground transition-colors group"
          >
            Vezi toate articolele <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((article, idx) => (
            <Link 
              key={idx} 
              href={article.href}
              className="glass-card group flex flex-col overflow-hidden rounded-2xl border border-[#F2DCDB]/20 bg-[#F2DCDB]/8 transition-all hover:bg-[#F2DCDB]/15 hover:shadow-lg hover:border-primary/40"
            >
              {article.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-white/10">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-primary">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs font-mono text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> {article.readTime}
                  </div>
                </div>
                
                <h3 className="mb-3 font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-[#F2DCDB]/20 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-muted-foreground">{article.date}</span>
                  <span className="inline-flex items-center text-sm font-bold font-sans text-foreground group-hover:text-primary">
                    Citește <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
