export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* StatGrid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-dark-surface rounded-lg p-4 h-24" />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-dark-surface rounded-xl p-4 h-64" />
        <div className="bg-dark-surface rounded-xl p-4 h-64" />
      </div>

      {/* Bottom section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-dark-surface rounded-xl p-4 h-64" />
        <div className="bg-dark-surface rounded-xl p-4 h-64" />
        <div className="bg-dark-surface rounded-xl p-4 h-64" />
      </div>
    </div>
  )
}
