import { HrEvaluareClient } from "@/components/hr-evaluare/HrEvaluareClient";

export const metadata = {
  title: "Evaluare Maturitate Guvernanță HR | VreauDigitalizare",
  description: "Evaluează gratuit nivelul de maturitate al departamentului tău de resurse umane și obține un plan de recomandări personalizate și o foaie de parcurs pe 90 de zile.",
};

export default function HrEvaluarePage() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-10 overflow-hidden">
      {/* Visual Accent top background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
      <HrEvaluareClient type="governance" />
    </div>
  );
}
