export function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-[var(--color-surface-elevated)] rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48 bg-[var(--color-surface-elevated)] rounded-xl" />
          <div className="h-48 bg-[var(--color-surface-elevated)] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
