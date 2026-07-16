"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSent(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-foreground/10 bg-[#1A1A1A]/95 shadow-2xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-foreground/10 bg-primary/10 p-4">
            <div>
              <h3 className="font-semibold text-foreground">Contactează-ne</h3>
              <p className="text-xs text-muted-foreground">Răspundem de obicei în câteva minute.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            {isSent ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-foreground">Mesaj trimis!</h4>
                <p className="text-sm text-muted-foreground">Te vom contacta în scurt timp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs text-muted-foreground">Email-ul tău</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-[#DB7F8E]"
                    placeholder="nume@companie.ro"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs text-muted-foreground">Cu ce te putem ajuta?</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full resize-none rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-[#DB7F8E]"
                    placeholder="Scrie-ne un mesaj..."
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-foreground hover:bg-[#b36371] mt-2">
                  Trimite Mesajul <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary text-foreground shadow-xl hover:bg-[#b36371] hover:scale-105 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
