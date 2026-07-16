"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send, List, AlignLeft, Tag, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useCompletion } from "@ai-sdk/react";

export function AiSidebar({
  currentContent,
  onUpdateContent,
  onUpdateTitle,
  onUpdateExcerpt,
  prompt,
  setPrompt,
}: {
  currentContent: string;
  onUpdateContent: (c: string) => void;
  onUpdateTitle?: (t: string) => void;
  onUpdateExcerpt?: (e: string) => void;
  prompt: string;
  setPrompt: (p: string) => void;
}) {

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/admin/ai/generate",
    onError: (err) => {
      toast.error("Eroare la generarea AI.");
      console.error(err);
    },
    onFinish: (prompt, completion) => {
      toast.success("Generare completă.");
    },
  });

  const getSystemPrompt = (baseContext: string) => {
    return baseContext;
  };

  const handleAction = async (actionPrompt: string, systemPromptBase: string) => {
    try {
      await complete(actionPrompt, {
        body: {
          contextText: currentContent,
          systemPrompt: getSystemPrompt(systemPromptBase),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOutline = () => {
    handleAction(
      "Generează un rezumat și structură cu puncte cheie (outline) pentru acest articol.",
      "Ești un asistent AI expert în structurarea articolelor. Returnezi doar codul HTML al structurii (h2, h3, ul, li)."
    );
  };

  const handleParagraph = () => {
    handleAction(
      "Rescrie și extinde următorul text într-un paragraf detaliat.",
      "Ești un asistent AI expert în copywriting. Returnezi doar codul HTML (p)."
    );
  };

  const handleMetaTags = () => {
    handleAction(
      "Generează cele mai bune Meta Title și Meta Description SEO pentru acest text.",
      "Returnează sugestia ta cu titluri bold, fără introduceri."
    );
  };

  const handleProofread = () => {
    handleAction(
      "Corectează gramatical și ortografic acest text. Nu adăuga idei noi, doar corectează.",
      "Ești un proofreader expert. Returnează doar textul curat în HTML."
    );
  };

  const handleCustomPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    await complete(prompt, {
      body: {
        contextText: currentContent,
        systemPrompt: getSystemPrompt("Ești un asistent AI pentru un CMS. Returnează conținut HTML curat pe baza instrucțiunii utilizatorului."),
      },
    });
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full bg-secondary/10 backdrop-blur-md shadow-xl overflow-hidden rounded-[20px] border border-secondary/30">
      <div className="p-4 flex items-center justify-between border-b border-secondary/30">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md">
            <Sparkles className="size-4 text-foreground" />
          </div>
          <h3 className="font-bold text-foreground text-sm">AI Content Assistant</h3>
        </div>
        <button className="text-accent/80 hover:text-muted-foreground">
          <span className="text-lg">⋯</span>
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="space-y-6">
          
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent/80 mb-3">Generate Content</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleOutline}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/10 backdrop-blur-md border border-secondary/30 p-4 shadow-lg hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <List className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Outline</span>
              </button>
              <button
                onClick={handleParagraph}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/10 backdrop-blur-md border border-secondary/30 p-4 shadow-lg hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <AlignLeft className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Paragraph</span>
              </button>
              <button
                onClick={handleMetaTags}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/10 backdrop-blur-md border border-secondary/30 p-4 shadow-lg hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <Tag className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Meta Tags</span>
              </button>
              <button
                onClick={handleProofread}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/10 backdrop-blur-md border border-secondary/30 p-4 shadow-lg hover:border-indigo-400 hover:shadow-md transition-all group disabled:opacity-50"
              >
                <CheckCircle className="size-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">Proofread</span>
              </button>
            </div>
          </div>

          {/* Live Completion Area */}
          {completion && (
            <div className="rounded-xl border border-indigo-100 bg-primary/20/30 p-4 relative">
              <h4 className="text-xs font-bold text-indigo-800 mb-2 flex items-center gap-1.5">
                {isLoading && <Loader2 className="size-3.5 animate-spin" />}
                Rezultat:
              </h4>
              <div 
                className="prose prose-sm max-w-none text-foreground mb-4 max-h-48 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: completion }} 
              />
              {!isLoading && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-indigo-100">
                  <button 
                    onClick={() => {
                      onUpdateContent(completion);
                      toast.success("Conținut înlocuit!");
                    }}
                    className="flex-1 rounded-lg bg-secondary/10 backdrop-blur-md border border-indigo-200 py-1.5 text-[11px] font-bold text-primary shadow-lg hover:bg-primary/20 transition-colors"
                  >
                    Înlocuiește
                  </button>
                  <button 
                    onClick={() => {
                      onUpdateContent(currentContent + "\n<br/>\n" + completion);
                      toast.success("Adăugat la final!");
                    }}
                    className="flex-1 rounded-lg bg-primary py-1.5 text-[11px] font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    Inserează
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="p-4 bg-accent/20 border-t border-secondary/30">
        <form onSubmit={handleCustomPrompt} className="relative bg-secondary/10 backdrop-blur-md rounded-xl shadow-lg border border-secondary/30 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 overflow-hidden">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to write or rewrite something..."
            className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-accent/80"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCustomPrompt(e as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-2 right-2 rounded-lg bg-indigo-500 p-2 text-primary-foreground hover:bg-primary disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>}
          </button>
        </form>
      </div>
    </div>
  );
}
