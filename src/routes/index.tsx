import { createFileRoute } from "@tanstack/react-router";
import { EmendaReader } from "@/components/emenda-reader";
import type { DocManifest } from "@/lib/document";
import manifest from "@/lib/doc-manifest.json";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <EmendaReader doc={manifest as DocManifest} />;
}
