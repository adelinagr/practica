import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

function CalendarIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2v3m8-3v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.71 15.18l-3.1-1.85A2.22 2.22 0 0 1 11.5 11.5V7.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="size-4 transition-transform group-hover/read:translate-x-0.5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border bg-background overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/30">
      {/* Cover image */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden bg-muted">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-sky-500 text-white shadow-sm">
          {post.category}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarIcon />
            {formatDate(post.publishedAt)}
          </span>
          <span className="size-1 rounded-full bg-muted-foreground/40" />
          <span className="flex items-center gap-1.5">
            <ClockIcon />
            {post.readingTime} min citire
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-base font-semibold text-foreground hover:text-sky-500 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-auto">
          <span className="text-xs text-muted-foreground font-medium">{post.author}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="group/read inline-flex items-center gap-1 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors"
          >
            Citește
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
