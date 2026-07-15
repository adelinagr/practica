"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { QuestionType } from "./admin-questionnaires-client";

interface AiQuestion {
  type: QuestionType;
  text: string;
  options: string[] | null;
  required: boolean;
}

export function AiQuestionnaireSidebar({
  onGenerate,
}: {
  onGenerate: (questions: AiQuestion[]) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const toastId = toast.loading("AI-ul gândește întrebările...");
    
    try {
      const res = await fetch("/api/admin/ai/generate-questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, numQuestions }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        onGenerate(data.questions);
        toast.success("Întrebări generate cu succes!", { id: toastId });
        setPrompt("");
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.error(err);
      toast.error("A apărut o eroare la generare.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary/10 backdrop-blur-md/50 backdrop-blur-xl border-l border-secondary/30 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-secondary/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h3 className="font-bold text-foreground">AI Questionnaire</h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <h4 className="text-sm font-bold text-foreground mb-2">Asistent Generare</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Descrie ce fel de formular sau chestionar vrei să construiești. AI-ul va genera automat o listă de întrebări cu opțiuni (dacă e cazul).
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Despre ce este vorba?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Formular de evaluare a performanței angajaților IT..."
                className="w-full resize-none rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 flex justify-between">
                <span>Număr estimativ de întrebări</span>
                <span className="text-primary">{numQuestions}</span>
              </label>
              <input 
                type="range" 
                min={1} 
                max={15} 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? "Se generează..." : "Generează cu AI"}
            </button>
          </form>
        </div>

        {/* Preset prompts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Idei Rapide</h4>
          <div className="flex flex-col gap-2">
            {[
              "Formular de Feedback Client (NPS)",
              "Audit Securitate IT pentru Angajați",
              "Sondaj pentru Lansare de Produs Nou",
              "Cerere Concediu și Zile Libere"
            ].map((idea, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(idea)}
                className="text-left px-3 py-2 rounded-lg bg-accent/20 border border-secondary/30 text-xs font-medium text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
