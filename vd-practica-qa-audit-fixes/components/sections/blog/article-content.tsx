import React from "react";

interface ArticleContentProps {
  contentHtml: string;
}

export function ArticleContent({ contentHtml }: ArticleContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6">
      <div 
        className="prose prose-lg prose-slate dark:prose-invert max-w-none 
          break-words [word-break:break-word]
          prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-blue-600 hover:prose-a:text-blue-500
          prose-img:rounded-2xl prose-img:shadow-sm
          prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-slate-700
          prose-p:leading-relaxed prose-p:break-words
          marker:text-blue-500"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
