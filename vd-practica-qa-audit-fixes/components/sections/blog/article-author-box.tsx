import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ArticleAuthorBoxProps {
  tags: string[];
  author: {
    name: string;
    role: string | null;
    image: string | null;
  };
}

export function ArticleAuthorBox({ tags, author }: ArticleAuthorBoxProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 pt-12 pb-16">
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-12">
          <span className="text-sm font-semibold text-slate-500 mr-2">Tags:</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Bio Box */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex-shrink-0">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-500 uppercase">
              {author.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="text-center sm:text-left flex-1">
          <h3 className="mb-1 text-lg font-bold text-slate-900">{author.name}</h3>
          {author.role && (
            <p className="mb-4 text-sm font-medium text-blue-600">{author.role}</p>
          )}
          <p className="mb-6 text-sm text-slate-500 leading-relaxed">
            {author.role ? `Autor pe VreauDigitalizare în rolul de ${author.role}.` : "Autor pe platforma VreauDigitalizare, aducând conținut de calitate și sfaturi utile pentru transformarea digitală a afacerii tale."}
          </p>
          
          <Link href={`/blog?search=${author.name}`} className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-700">
            Vezi toate articolele de {author.name} →
          </Link>
        </div>
      </div>
    </div>
  );
}
