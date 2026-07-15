"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()}
      className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl shadow-lg print:hidden"
    >
      <FileText className="mr-2 size-4" />
      Descarcă Raportul PDF
    </Button>
  );
}
