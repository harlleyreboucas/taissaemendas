export type DocTile = {
  src: string;
  height: number;
  bytes: number;
};

export type DocPage = {
  id: number;
  width: number;
  height: number;
  thumb: string;
  tiles: DocTile[];
};

export type DocManifest = {
  title: string;
  source: string;
  pageCount: number;
  originalBytes: number;
  webpBytes: number;
  thumbBytes: number;
  pdfBytes: number;
  pdfHref: string;
  pages: DocPage[];
};

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;

export function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 20) / 20));
}

/** Zoom that paints the page at ~1 CSS pixel per source pixel (readable text). */
export function nativeZoom(viewWidth: number, pageWidth: number): number {
  if (viewWidth <= 0) return 1;
  return clampZoom(pageWidth / viewWidth);
}
