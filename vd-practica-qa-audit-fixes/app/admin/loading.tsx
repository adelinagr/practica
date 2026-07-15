export default function AdminPanelLoading() {
  return (
    <div className="min-h-full animate-pulse p-7">
      <div className="mb-5 h-8 w-52 rounded-lg bg-accent/20" />
      <div className="mb-6 flex gap-3">
        <div className="h-9 w-40 rounded-lg bg-accent/20" />
        <div className="h-9 w-32 rounded-lg bg-accent/20" />
      </div>
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-accent/20" />
        ))}
      </div>
      <div className="mb-5 flex gap-4">
        <div className="h-52 flex-1 rounded-xl bg-accent/20" />
        <div className="h-52 w-[280px] rounded-xl bg-accent/20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-44 rounded-xl bg-accent/20" />
        <div className="h-44 rounded-xl bg-accent/20" />
      </div>
    </div>
  );
}
