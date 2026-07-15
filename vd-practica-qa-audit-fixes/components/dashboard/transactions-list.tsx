"use client";

import { useState } from "react";
import { ArrowUpDown, MoreHorizontal, Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = "active" | "pending" | "blocked" | "processing";

interface Row {
  id: string;
  name: string;
  email: string;
  type: string;
  status: Status;
  date: string;
  amount: string;
  initials: string;
  avatarColor: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const ROWS: Row[] = [
  {
    id: "1", name: "Liam Johnson",     email: "liam@company.ro",    type: "Sale",         status: "active",     date: "20 mai 2025",  amount: "€2,500", initials: "LJ", avatarColor: "from-indigo-500 to-purple-600",
  },
  {
    id: "2", name: "Olivia Smith",     email: "olivia@startup.io",  type: "Refund",       status: "pending",    date: "18 mai 2025",  amount: "€1,200", initials: "OS", avatarColor: "from-rose-400 to-pink-600",
  },
  {
    id: "3", name: "Noah Williams",    email: "noah@enterprise.eu", type: "Subscription", status: "active",     date: "15 mai 2025",  amount: "€3,500", initials: "NW", avatarColor: "from-emerald-400 to-teal-600",
  },
  {
    id: "4", name: "Emma Brown",       email: "emma@agency.ro",     type: "Sale",         status: "processing", date: "12 mai 2025",  amount: "€4,800", initials: "EB", avatarColor: "from-sky-400 to-blue-600",
  },
  {
    id: "5", name: "James Miller",     email: "james@corp.eu",      type: "Sale",         status: "blocked",    date: "10 mai 2025",  amount: "€890",   initials: "JM", avatarColor: "from-amber-400 to-orange-500",
  },
  {
    id: "6", name: "Sophia Davis",     email: "sophia@group.ro",    type: "Subscription", status: "active",     date: "8 mai 2025",   amount: "€6,200", initials: "SD", avatarColor: "from-fuchsia-500 to-violet-600",
  },
];

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Status, { label: string; classes: string; dot: string }> = {
  active:     { label: "Active",     classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",   dot: "bg-emerald-500" },
  pending:    { label: "Pending",    classes: "bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20",       dot: "bg-amber-500"   },
  blocked:    { label: "Blocked",    classes: "bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/20",        dot: "bg-rose-500"    },
  processing: { label: "Processing", classes: "bg-sky-500/10    text-sky-600    dark:text-sky-400    border-sky-500/20",         dot: "bg-sky-500"     },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.classes}`}>
      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TransactionsList() {
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = ROWS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()),
  ).sort((a, b) =>
    sortDir === "desc"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
      {/* ── Table header bar ── */}
      <div className="flex flex-col gap-3 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Tranzacții Recente</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} {filtered.length === 1 ? "înregistrare" : "înregistrări"} găsite
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-8 w-48 rounded-lg border border-border/70 bg-muted/40 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-500/15 transition-all"
            />
          </div>

          {/* Filter dropdown (decorative) */}
          <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-indigo-400/40 hover:text-foreground">
            <SlidersHorizontal className="size-3.5" />
            Filtre
          </button>

          {/* View all */}
          <button className="inline-flex h-8 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.97]">
            Toate
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Sticky header */}
          <thead>
            <tr className="border-b border-border/40 bg-muted/25">
              <th className="px-5 py-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Client
                </span>
              </th>
              <th className="hidden px-4 py-3 text-left sm:table-cell">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Tip
                </span>
              </th>
              <th className="hidden px-4 py-3 text-left md:table-cell">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 transition-colors hover:text-foreground"
                >
                  Data
                  <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Sumă
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="sr-only">Acțiuni</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/30">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Niciun rezultat găsit.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Avatar + name/email */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${row.avatarColor} text-[11px] font-bold text-white shadow-sm`}>
                        {row.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground leading-none">
                          {row.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {row.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="hidden px-4 py-3.5 sm:table-cell">
                    <span className="text-xs text-muted-foreground">{row.type}</span>
                  </td>

                  {/* Status */}
                  <td className="hidden px-4 py-3.5 md:table-cell">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-muted-foreground">{row.date}</span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-semibold text-foreground">{row.amount}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ── */}
      <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? "0 înregistrări"
            : `${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} din ${filtered.length}`}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-xs text-muted-foreground transition-colors hover:border-indigo-400/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                p === page
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-border/60 text-muted-foreground hover:border-indigo-400/40 hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-xs text-muted-foreground transition-colors hover:border-indigo-400/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
