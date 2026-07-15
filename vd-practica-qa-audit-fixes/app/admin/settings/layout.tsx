import React from "react";
import { SettingsSidebar } from "@/components/admin/settings/settings-sidebar";

export const metadata = {
  title: "Settings - VreauDigitalizare Admin",
  description: "Enterprise Settings Management",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1200px] mx-auto p-4 md:p-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <SettingsSidebar />
      </aside>
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
