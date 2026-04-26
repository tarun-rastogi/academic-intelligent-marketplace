import { Suspense } from "react";
import { DiscoverySurface } from "@/components/DiscoverySurface";
import { Shell } from "@/components/Shell";
import { CatalogView } from "./CatalogView";

export const dynamic = "force-dynamic";

function CatalogFallback() {
  return (
    <Shell>
      <DiscoverySurface>
        <p className="py-12 text-center text-sm text-white/75">Loading catalogue…</p>
      </DiscoverySurface>
    </Shell>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogView />
    </Suspense>
  );
}
