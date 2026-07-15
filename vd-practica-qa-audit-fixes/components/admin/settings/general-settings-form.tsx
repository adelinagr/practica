"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { updateGeneralSettings } from "@/app/admin/settings/actions";
import { Loader2, UploadCloud, User } from "lucide-react";
import Image from "next/image";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  company: string | null;
  phone: string | null;
  timezone: string | null;
  language: string | null;
  jobTitle: string | null;
  role: string;
};

export function GeneralSettingsForm({ user }: { user: UserData }) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user.image);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      jobTitle: formData.get("jobTitle") as string,
      phone: formData.get("phone") as string,
      timezone: formData.get("timezone") as string,
      language: formData.get("language") as string,
      image: formData.get("image") as string | null,
    };

    const result = await updateGeneralSettings(data);
    setLoading(false);

    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.error || "Failed to update profile.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
      <input type="hidden" name="image" value={avatar || ""} />
      {/* Avatar Section */}
      <div className="flex items-start gap-6 rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg">
        <div className="relative group shrink-0">
          {avatar ? (
            <Image
              src={avatar}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover shadow-lg size-20"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-accent/20 text-accent/80">
              <User className="size-8" />
            </div>
          )}
          <label 
            className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
          >
            <UploadCloud className="size-6 text-white" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const toastId = toast.loading("Se încarcă...");
                const fd = new FormData();
                fd.append("file", file);
                try {
                  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                  if (!res.ok) throw new Error("Upload failed");
                  const data = await res.json();
                  setAvatar(data.url);
                  toast.success("Imagine încărcată!", { id: toastId });
                } catch {
                  toast.error("Eroare la încărcare", { id: toastId });
                }
              }}
            />
          </label>
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Profile Picture</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Click on the avatar to upload a custom one from your files.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
              Role: {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg">
        <h4 className="text-sm font-bold text-foreground mb-2">Personal Information</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-foreground">Full Name</label>
            <input 
              required
              id="name" 
              name="name" 
              defaultValue={user.name || ""} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground placeholder:text-accent/80 focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-foreground">Email Address</label>
            <input 
              required
              type="email"
              id="email" 
              name="email" 
              defaultValue={user.email || ""} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground placeholder:text-accent/80 focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" 
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-bold text-foreground">Company</label>
            <input 
              id="company" 
              name="company" 
              defaultValue={user.company || ""} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground placeholder:text-accent/80 focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="text-sm font-bold text-foreground">Job Title</label>
            <input 
              id="jobTitle" 
              name="jobTitle" 
              defaultValue={user.jobTitle || ""} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground placeholder:text-accent/80 focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" 
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-bold text-foreground">Phone Number</label>
            <input 
              type="tel"
              id="phone" 
              name="phone" 
              defaultValue={user.phone || ""} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground placeholder:text-accent/80 focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors" 
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-lg">
        <h4 className="text-sm font-bold text-foreground mb-2">Preferences</h4>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="language" className="text-sm font-bold text-foreground">Language</label>
            <select 
              id="language" 
              name="language" 
              defaultValue={user.language || "ro"} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="ro">Română (RO)</option>
              <option value="en">English (US)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="timezone" className="text-sm font-bold text-foreground">Timezone</label>
            <select 
              id="timezone" 
              name="timezone" 
              defaultValue={user.timezone || "Europe/Bucharest"} 
              className="w-full rounded-xl border border-secondary/30 bg-accent/20 px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:bg-secondary/10 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="Europe/Bucharest">Europe / Bucharest (EET)</option>
              <option value="Europe/London">Europe / London (GMT)</option>
              <option value="America/New_York">America / New York (EST)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-secondary/30 pt-6">
        <button 
          disabled={loading} 
          type="submit" 
          className="flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
