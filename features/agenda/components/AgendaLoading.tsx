export function AgendaLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading the agenda…</span>
      {[0, 1, 2].map((item) => (
        <div key={item} aria-hidden="true" className="space-y-3">
          <div className="h-40 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
          <div className="ml-3 space-y-3 border-l-2 border-muted pl-4 sm:ml-8 sm:pl-6">
            <div className="h-28 animate-pulse rounded-xl bg-muted/70 motion-reduce:animate-none" />
            {item === 0 && (
              <div className="h-28 animate-pulse rounded-xl bg-muted/70 motion-reduce:animate-none" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
