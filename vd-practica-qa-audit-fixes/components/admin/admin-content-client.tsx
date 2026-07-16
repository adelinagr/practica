"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Globe,
  FileText,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TiptapEditor } from "./tiptap-editor";
import { AiSidebar } from "./ai-sidebar";

interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  seoTitle?: string | null;
  seoDesc?: string | null;
  tags?: string[];
  createdAt: Date;
}

export function AdminContentClient({ initialData }: { initialData: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialData);
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<"settings" | "ai">("settings");

  // Editor State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  
  // Autosave status
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const isInitialMount = useRef(true);
  const autosaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const autoSlug = (t: string) =>
    t.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const openEditor = async (post?: Post) => {
    if (post) {
      let fullContent = post.content ?? "";
      if (!fullContent) {
        try {
          const res = await fetch(`/api/admin/posts/${post.id}`);
          if (res.ok) {
            const data = await res.json();
            fullContent = data.content ?? "";
          }
        } catch {
          toast.error("Eroare la încărcarea articolului.");
          return;
        }
      }
      setEditingPost(post);
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setSeoTitle(post.seoTitle || "");
      setSeoDesc(post.seoDesc || "");
      setTags(post.tags || []);
      setImageUrl(post.imageUrl || "");
      setContent(fullContent);
      setLastSaved(new Date());
    } else {
      setEditingPost(null);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setSeoTitle("");
      setSeoDesc("");
      setTags([]);
      setImageUrl("");
      setContent("");
      setLastSaved(null);
    }
    isInitialMount.current = true;
    setView("editor");
  };

  const handleSave = async (published: boolean, silent = false) => {
    if (!title.trim() && !silent) {
      toast.error("Titlul este obligatoriu.");
      return;
    }
    if (!title.trim() && silent) return; // ignore silent save if no title

    if (!silent) setSaving(true);
    
    try {
      const payload = {
        title: title.trim() || "Untitled",
        slug: slug.trim() || autoSlug(title) || `draft-${Date.now()}`,
        content,
        excerpt: excerpt.trim() || null,
        seoTitle: seoTitle.trim() || null,
        seoDesc: seoDesc.trim() || null,
        tags,
        imageUrl: imageUrl.trim() || null,
        published,
      };

      let res: Response;
      if (editingPost) {
        res = await fetch(`/api/admin/posts/${editingPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        if (!silent) toast.error("Eroare la salvare.");
        return;
      }

      const saved: Post = await res.json();
      
      if (!silent) {
        toast.success(
          editingPost
            ? published
              ? "Articol publicat!"
              : "Draft salvat!"
            : published
            ? "Articol creat și publicat!"
            : "Draft creat!"
        );
        setView("list");
      }

      if (editingPost) {
        setPosts((prev) => prev.map((p) => (p.id === saved.id ? { ...p, ...saved } : p)));
      } else {
        setPosts((prev) => [saved, ...prev]);
        setEditingPost(saved); // Upgrade from new to editing so autosave uses PATCH
      }

      setLastSaved(new Date());
    } catch {
      if (!silent) toast.error("Eroare de rețea.");
    } finally {
      if (!silent) setSaving(false);
    }
  };

  // Autosave hook
  useEffect(() => {
    if (view !== "editor") return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);

    autosaveTimeout.current = setTimeout(() => {
      // Only autosave if we have a title (it's required)
      if (title.trim()) {
        const isCurrentlyPublished = editingPost?.published || false;
        handleSave(isCurrentlyPublished, true);
      }
    }, 3000);

    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, slug, excerpt, imageUrl]);

  const handleDelete = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest articol? Acțiunea este ireversibilă.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Articol șters.");
      } else {
        toast.error("Eroare la ștergere.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        toast.success(updated.published ? "Articol publicat!" : "Articol mutat în draft.");
      } else {
        toast.error("Eroare la actualizare.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Se încarcă coperta...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Copertă încărcată!", { id: toastId });
    } catch (err) {
      toast.error("Eroare la încărcare", { id: toastId });
    }
  };

  // ─── Editor View ──────────────────────────────────────────────────────────────

  if (view === "editor") {
    return (
      <div className="flex h-full flex-col bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {/* Editor Top Bar */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-secondary/30 bg-secondary/10 backdrop-blur-md px-6 py-3 shadow-lg z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const isCurrentlyPublished = editingPost?.published || false;
                handleSave(isCurrentlyPublished, true); // save draft on exit
                setView("list");
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" /> Înapoi
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {editingPost ? "Editare Articol" : "Articol Nou"}
              </span>
              {lastSaved && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-accent/80">
                  <CheckCircle2 className="size-3 text-green-500" />
                  Salvat la {lastSaved.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-accent/20 rounded-lg p-1 mr-2">
              <button
                onClick={() => setActiveSidebar("settings")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeSidebar === "settings" ? "bg-secondary/10 backdrop-blur-md text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                Setări
              </button>
              <button
                onClick={() => setActiveSidebar("ai")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${activeSidebar === "ai" ? "bg-secondary/10 backdrop-blur-md text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sparkles className="size-3" /> AI Assistant
              </button>
            </div>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-secondary/30 bg-secondary/10 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-accent/20 transition-colors disabled:opacity-60 shadow-lg"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              Salvează Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-1.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
              {editingPost?.published ? "Actualizează Publicat" : "Publică Acum"}
            </button>
          </div>
        </div>

        {/* Editor Body (Full Width CMS Layout) */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Editing Area */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 bg-secondary/10 backdrop-blur-md flex justify-center">
            <div className="w-full max-w-4xl flex flex-col gap-6">
              
              {/* Cover Image Upload */}
              <div className="group relative w-full h-64 sm:h-72 shrink-0 rounded-2xl bg-accent/20 border-2 border-dashed border-secondary/50 hover:border-indigo-400 transition-colors flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer bg-secondary/10 backdrop-blur-md text-foreground font-bold px-4 py-2 rounded-xl text-sm hover:bg-accent/20 shadow-lg flex items-center gap-2">
                        <UploadCloud className="size-4" /> Schimbă
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                      </label>
                      <button onClick={() => setImageUrl("")} className="bg-red-500 text-foreground font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-600 shadow-lg flex items-center gap-2">
                        <Trash2 className="size-4" /> Șterge
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors w-full h-full absolute inset-0">
                    <ImageIcon className="size-10 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col items-center">
                      <span className="text-base font-semibold">Apasă aici pentru a adăuga imaginea de copertă</span>
                      <span className="text-xs opacity-70 mt-1">Format recomandat: 16:9 (JPG, PNG, WEBP)</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingPost) setSlug(autoSlug(e.target.value));
                }}
                placeholder="Titlul articolului..."
                className="w-full bg-transparent text-4xl sm:text-5xl font-extrabold text-foreground placeholder:text-accent/60 outline-none"
              />
              
              {/* TipTap Rich Text Editor */}
              <div className="mt-4 pb-32">
                <TiptapEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Right Sidebar (Settings / AI) */}
          <div className="w-[320px] flex-shrink-0 border-l border-secondary/30 bg-[#F8F9FC] overflow-y-auto hidden lg:block">
            {activeSidebar === "settings" ? (
              <div className="p-5 space-y-6">
                
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-foreground">SEO & Metadata</h4>
                  <button 
                    onClick={() => {
                      setActiveSidebar("ai");
                      setAiPrompt("Generează Meta Tags (SEO Title și Description) pentru acest articol bazat pe conținutul de până acum.");
                    }}
                    className="text-[11px] font-semibold text-primary hover:text-primary transition-colors"
                  >
                    Generate with AI
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Meta Title</label>
                    <input
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <p className="text-[10px] text-accent/80 text-right">
                      {seoTitle.length}/60 chars {seoTitle.length > 60 && "(slightly long)"}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Meta Description</label>
                    <textarea
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <p className="text-[10px] text-accent/80 text-right">
                      {seoDesc.length}/160 chars {seoDesc.length > 160 && "(slightly long)"}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">URL Slug</label>
                    <div className="flex items-center rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
                      <span className="px-3 py-2 bg-accent/20 border-r border-secondary/30 text-sm text-accent/80 font-mono">/blog/</span>
                      <input
                        value={slug}
                        onChange={(e) => setSlug(autoSlug(e.target.value))}
                        className="flex-1 px-3 py-2 text-sm text-foreground outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Tags</label>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {tags.map((t, idx) => (
                          <span key={idx} className="flex items-center gap-1 bg-accent/20 text-foreground px-2.5 py-1 rounded-md text-[11px] font-medium border border-secondary/30">
                            {t}
                            <button 
                              onClick={() => setTags(tags.filter((_, i) => i !== idx))} 
                              className="hover:text-red-500 text-accent/80 ml-0.5"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          if (!tags.includes(tagInput.trim())) {
                            setTags([...tags, tagInput.trim()]);
                          }
                          setTagInput("");
                        }
                      }}
                      placeholder="Add a tag..."
                      className="w-full rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="pt-5 border-t border-secondary/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Stare Articol</h4>
                    <div className="rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {editingPost?.published ? "Publicat" : "Draft"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Vizibilitate pe site
                        </span>
                      </div>
                      <div className={`size-3 rounded-full ${editingPost?.published ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-400'}`} />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <AiSidebar 
                currentContent={content} 
                onUpdateContent={setContent} 
                onUpdateTitle={setTitle}
                onUpdateExcerpt={setExcerpt}
                prompt={aiPrompt}
                setPrompt={setAiPrompt}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────────────

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleWordImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Se importă documentul Word...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/docx", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Import failed");
      const data = await res.json();
      
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      
      setEditingPost(null);
      setTitle(fileNameWithoutExt);
      setSlug(autoSlug(fileNameWithoutExt));
      setExcerpt("");
      setImageUrl("");
      setContent(data.html);
      setLastSaved(null);
      isInitialMount.current = true;
      setView("editor");
      
      toast.success("Document importat cu succes!", { id: toastId });
    } catch (err) {
      toast.error("Eroare la importul documentului", { id: toastId });
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-full p-6 md:p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog & Articole</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestionează conținutul publicat, crează articole noi și optimizează SEO.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md px-3 py-2 shadow-lg focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
            <Search className="size-4 text-accent/80" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută articol..."
              className="w-full sm:w-48 bg-transparent text-sm text-foreground outline-none"
            />
          </div>
          <label className="cursor-pointer flex flex-shrink-0 items-center gap-2 rounded-xl border border-indigo-200 bg-primary/20 px-4 py-2 text-sm font-bold text-primary shadow-lg hover:bg-primary/30 transition-colors">
            <UploadCloud className="size-4" /> <span className="hidden lg:inline">Importă Word</span>
            <input type="file" accept=".docx" className="hidden" onChange={handleWordImport} />
          </label>
          <button
            onClick={() => openEditor()}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> <span className="hidden lg:inline">Articol Nou</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/50 bg-accent/20 py-24 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-200 mb-4">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Niciun rezultat</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            {search ? "Nu am găsit niciun articol care să se potrivească căutării." : "Nu ai publicat niciun articol încă. Începe prin a crea primul tău post."}
          </p>
          {!search && (
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              <Plus className="size-4" /> Scrie Acum
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((post) => (
            <div key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-lg hover:shadow-md hover:border-indigo-200 transition-all">
              <div className="relative h-40 w-full bg-accent/20 overflow-hidden">
                {post.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent/20">
                    <FileText className="size-10 text-accent/60" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold shadow-lg backdrop-blur-md",
                    post.published ? "bg-emerald-500/90 text-foreground" : "bg-amber-400/90 text-foreground"
                  )}>
                    {post.published ? "Publicat" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-foreground line-clamp-2 mb-1">{post.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 font-mono truncate">/{post.slug}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-secondary/30">
                  <span className="text-[11px] font-medium text-accent/80">
                    {new Date(post.createdAt).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      title={post.published ? "Mută în Draft" : "Publică"}
                      className="rounded-lg p-2 text-accent/80 hover:bg-accent/20 hover:text-foreground transition-colors"
                    >
                      {post.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button
                      onClick={() => openEditor(post)}
                      title="Editează"
                      className="rounded-lg p-2 text-accent/80 hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      title="Șterge"
                      className="rounded-lg p-2 text-accent/80 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting === post.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
