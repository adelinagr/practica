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
        <div className="mb-4 w-[350px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A]/95 shadow-2xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#DB7F8E]/10 p-4">
            <div>
              <h3 className="font-semibold text-white">Contactează-ne</h3>
              <p className="text-xs text-[#9DA3A4]">Răspundem de obicei în câteva minute.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#9DA3A4] hover:text-white"
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
                <h4 className="font-medium text-white">Mesaj trimis!</h4>
                <p className="text-sm text-[#9DA3A4]">Te vom contacta în scurt timp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs text-[#9DA3A4]">Email-ul tău</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#9DA3A4]/50 focus:border-[#DB7F8E] focus:outline-none focus:ring-1 focus:ring-[#DB7F8E]"
                    placeholder="nume@companie.ro"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs text-[#9DA3A4]">Cu ce te putem ajuta?</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#9DA3A4]/50 focus:border-[#DB7F8E] focus:outline-none focus:ring-1 focus:ring-[#DB7F8E]"
                    placeholder="Scrie-ne un mesaj..."
                  />
                </div>
                <Button type="submit" className="w-full bg-[#DB7F8E] text-white hover:bg-[#b36371] mt-2">
                  Trimite Mesajul <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-[#DB7F8E] text-white shadow-xl hover:bg-[#b36371] hover:scale-105 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
