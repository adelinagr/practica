export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-background animate-pulse">
      <div className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border/40">
        <div className="container max-w-4xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center space-y-6">
          <div className="h-8 w-48 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-16 w-full max-w-2xl rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-full max-w-xl rounded-lg bg-slate-200 dark:bg-slate-800 mt-4" />
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Skeleton Featured Post */}
        <div className="mb-16 flex flex-col md:flex-row h-[400px] w-full rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden" />

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          <div className="grid sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
          <div className="space-y-10">
            <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
