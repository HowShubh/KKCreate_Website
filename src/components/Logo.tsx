export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron font-display text-lg font-bold leading-none text-paper">
        KK
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-content">
        Create
      </span>
    </span>
  );
}
