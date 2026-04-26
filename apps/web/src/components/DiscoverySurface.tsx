/**
 * Shared discovery canvas (search + catalogue) — navy gradient, gold eyebrow rhythm,
 * consistent max width with Shell.
 */
export function DiscoverySurface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-hidden bg-gradient-to-b from-[#050c22] via-[#0c226b] to-[#040818] text-white ${className}`.trim()}
    >
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">{children}</div>
    </div>
  );
}
