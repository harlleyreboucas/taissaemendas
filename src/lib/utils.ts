import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) {
    const n = kb >= 100 ? kb.toFixed(0) : kb.toFixed(1);
    return `${n.replace(".", ",")} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1).replace(".", ",")} MB`;
}
