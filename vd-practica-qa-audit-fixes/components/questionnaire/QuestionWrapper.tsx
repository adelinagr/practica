import React from "react";
import { cn } from "@/lib/utils";

interface QuestionWrapperProps {
    children: React.ReactNode;
    visible: boolean;
}

export function QuestionWrapper({ children, visible }: QuestionWrapperProps) {
    return (
        <div
            className={cn(
                "transition-all duration-500 ease-in-out origin-top",
                visible
                    ? "max-h-[1200px] opacity-100 transform scale-100 py-4"
                    : "max-h-0 opacity-0 scale-95 py-0 overflow-hidden pointer-events-none"
            )}
        >
            {children}
        </div>
    );
}