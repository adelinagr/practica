"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Shield, 
  UserPlus, 
  Trash2, 
  Edit3, 
  UserMinus, 
  CheckCircle2, 
  UserCheck, 
  Loader2, 
  X,
  Lock,
  Mail,
  User,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status: string;
  createdAt: Date;
  image: string | null;
}

interface TeamSettingsClientProps {
  initialMembers: TeamMember[];
  currentUser: { id: string; email?: string | null };
}

export function TeamSettingsClient({ initialMembers, currentUser }: TeamSettingsClientProps) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Form states
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");
  const [editRoleValue, setEditRoleValue] = useState("VIEWER");
  const [submitting, setSubmitting] = useState(false);

  // Invite action
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        toast.error(err || "Eroare la trimiterea invitației.");
        return;
      }

      const newMember = await res.json();
      setMembers((prev) => [newMember, ...prev]);
      setInviteEmail("");
      setInviteRole("VIEWER");
      setInviteModalOpen(false);
      toast.success("Invitație trimisă cu succes!");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit role action
  const handleEditRole = async () => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/team/${selectedMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRoleValue }),
      });

      if (!res.ok) {
        toast.error("Eroare la actualizarea rolului.");
        return;
      }

      const updated = await res.json();
      setMembers((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, role: updated.role } : m))
      );
      setEditRoleModalOpen(false);
      setSelectedMember(null);
      toast.success("Rol actualizat cu succes!");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle status action (deactivate/activate)
  const handleToggleStatus = async (member: TeamMember) => {
    if (member.id === currentUser.id) {
      toast.error("Nu vă puteți modifica propriul status.");
      return;
    }

    const newStatus = member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const loadingToast = toast.loading("Se actualizează statusul...");

    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error("Eroare la actualizarea statusului.");
        return;
      }

      const updated = await res.json();
      setMembers((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, status: updated.status } : m))
      );
      toast.success(
        updated.status === "ACTIVE" ? "Utilizator activat!" : "Utilizator dezactivat!"
      );
      startTransition(() => router.refresh());
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Eroare de rețea.");
    }
  };

  // Delete member action
  const handleDelete = async (member: TeamMember) => {
    if (member.id === currentUser.id) {
      toast.error("Nu vă puteți șterge propriul cont din această listă.");
      return;
    }

    if (!confirm(`Sigur doriți să ștergeți utilizatorul ${member.email}?`)) {
      return;
    }

    const loadingToast = toast.loading("Se șterge membrul...");

    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "DELETE",
      });

      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error("Eroare la ștergerea membrului.");
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      toast.success("Membru șters din echipă.");
      startTransition(() => router.refresh());
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Eroare de rețea.");
    }
  };

  // Helper for rendering role badge
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/20 dark:text-purple-400">
            <Shield className="size-3" />
            Admin
          </span>
        );
      case "EDITOR":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground dark:bg-primary/20 dark:text-primary">
            <Edit3 className="size-3" />
            Editor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-bold text-muted-foreground dark:bg-slate-900/30 dark:text-accent/80">
            <User className="size-3" />
            Viewer
          </span>
        );
    }
  };

  // Helper for rendering status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground dark:text-slate-50">Gestionare Echipă</h3>
          <p className="text-sm text-muted-foreground mt-1 dark:text-accent/80">
            Invitați utilizatori, modificați roluri și controlați accesul membrilor la chestionare.
          </p>
        </div>
        <button
          onClick={() => setInviteModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-slate-800 active:scale-98 transition-all dark:bg-accent/20 dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <UserPlus className="size-4" />
          Invită Membru
        </button>
      </div>

      <div className="h-px bg-accent/20 dark:bg-slate-800" />

      {/* Grid container */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-lg overflow-hidden dark:border-slate-800 dark:bg-[#12151c]">
        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-secondary/30 bg-accent/20/50 text-[11px] font-bold uppercase tracking-wider text-accent/80 dark:border-slate-800 dark:bg-slate-900/30">
                <th className="px-6 py-4">Nume / Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Adăugat La</th>
                <th className="px-6 py-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((member) => (
                <tr 
                  key={member.id} 
                  className={cn(
                    "hover:bg-accent/20/30 transition-colors dark:hover:bg-slate-900/10",
                    member.status === "INACTIVE" && "opacity-75"
                  )}
                >
                  {/* Name/Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.image} alt="Avatar" className="size-9 rounded-full object-cover" />
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-muted-foreground font-bold uppercase dark:bg-slate-800 dark:text-accent/60">
                          {member.name?.charAt(0) || member.email?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground dark:text-slate-100">
                          {member.name || member.email?.split("@")[0]}
                          {member.id === currentUser.id && (
                            <span className="ml-2 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-slate-800 dark:text-accent/80">
                              Tu
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-accent/80">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {renderRoleBadge(member.role)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {renderStatusBadge(member.status)}
                  </td>

                  {/* Date Added */}
                  <td className="px-6 py-4 text-xs text-accent/80">
                    {new Date(member.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit Role Button */}
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setEditRoleValue(member.role);
                          setEditRoleModalOpen(true);
                        }}
                        disabled={member.id === currentUser.id}
                        title="Modifică Rolul"
                        className="rounded-lg p-1.5 text-accent/80 hover:bg-accent/20 hover:text-foreground transition-colors disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-slate-800"
                      >
                        <Edit3 className="size-4" />
                      </button>

                      {/* Deactivate/Activate Toggle */}
                      <button
                        onClick={() => handleToggleStatus(member)}
                        disabled={member.id === currentUser.id}
                        title={member.status === "ACTIVE" ? "Dezactivează Utilizator" : "Activează Utilizator"}
                        className={cn(
                          "rounded-lg p-1.5 transition-colors disabled:opacity-40 disabled:hover:bg-transparent",
                          member.status === "ACTIVE" 
                            ? "text-accent/80 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20" 
                            : "text-accent/80 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/20"
                        )}
                      >
                        {member.status === "ACTIVE" ? (
                          <UserMinus className="size-4" />
                        ) : (
                          <UserCheck className="size-4" />
                        )}
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleDelete(member)}
                        disabled={member.id === currentUser.id}
                        title="Șterge"
                        className="rounded-lg p-1.5 text-accent/80 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-rose-950/20"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-2xl dark:border-slate-800 dark:bg-[#12151c] animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setInviteModalOpen(false)} 
              className="absolute right-4 top-4 text-accent/80 hover:text-muted-foreground dark:hover:text-slate-200"
            >
              <X className="size-5" />
            </button>
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary dark:bg-indigo-950/30 dark:text-primary">
                <UserPlus className="size-5" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-foreground dark:text-slate-50">Invită Membru Nou</h2>
                <p className="text-[11px] text-accent/80 mt-0.5">Utilizatorul va fi pre-creat și va putea completa înregistrarea.</p>
              </div>
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-accent/80" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@exemplu.com"
                    className="h-10 w-full rounded-lg border border-secondary/30 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rol Workspace</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="h-10 w-full rounded-lg border border-secondary/30 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                >
                  <option value="VIEWER">Viewer (Vizualizare doar chestionare atribuite)</option>
                  <option value="EDITOR">Editor (Editare chestionare proprii/atribuite)</option>
                  <option value="ADMIN">Admin (Acces deplin & gestiune echipă)</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitting ? "Se trimite..." : "Trimite Invitație"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editRoleModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-secondary/30 bg-secondary/10 backdrop-blur-md p-6 shadow-2xl dark:border-slate-800 dark:bg-[#12151c] animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => {
                setEditRoleModalOpen(false);
                setSelectedMember(null);
              }} 
              className="absolute right-4 top-4 text-accent/80 hover:text-muted-foreground dark:hover:text-slate-200"
            >
              <X className="size-5" />
            </button>
            
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground dark:bg-primary/30 dark:text-primary">
                <Edit3 className="size-5" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-foreground dark:text-slate-50">Modifică Rol Membru</h2>
                <p className="text-[11px] text-accent/80 mt-0.5">Schimbați permisiunile pentru {selectedMember.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alege Rol Nou</label>
                <select
                  value={editRoleValue}
                  onChange={(e) => setEditRoleValue(e.target.value)}
                  className="h-10 w-full rounded-lg border border-secondary/30 px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                >
                  <option value="VIEWER">Viewer (Vizualizare doar chestionare atribuite)</option>
                  <option value="EDITOR">Editor (Editare chestionare proprii/atribuite)</option>
                  <option value="ADMIN">Admin (Acces deplin & gestiune echipă)</option>
                </select>
              </div>

              <button
                onClick={handleEditRole}
                disabled={submitting}
                className="mt-2 flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitting ? "Se salvează..." : "Salvează Rol"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
