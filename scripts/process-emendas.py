#!/usr/bin/env python3
"""Extract, lossless-compress, tile, and rebuild the emendas PDF for mobile."""

from __future__ import annotations

import json
import re
import zlib
from pathlib import Path

from PIL import Image

SRC = Path("/workspace/attachments/emendasdeputadataissa.pdf")
OUT_DIR = Path("/workspace/public/doc")
PDF_OUT = Path("/workspace/public/emendas-rondonia-leve.pdf")
ART_PDF = Path("/workspace/artifacts/emendas-rondonia-leve.pdf")
MANIFEST = OUT_DIR / "manifest.json"
TILE_H = 1280
PAGE_PT_W = 480.0


def parse_pdf_images(data: bytes) -> list[tuple[int, int, bytes]]:
    pages: list[tuple[int, int, bytes]] = []
    for m in re.finditer(
        rb"(\d+) 0 obj\n(<<[^>]*?/Subtype /Image[^>]*?>>)\nstream\n",
        data,
    ):
        d = m.group(2)
        if b"/Name /Im0" not in d and b"/Name/Im0" not in d:
            continue
        w_m = re.search(rb"/Width (\d+)", d)
        h_m = re.search(rb"/Height (\d+)", d)
        l_m = re.search(rb"/Length (\d+)", d)
        if not (w_m and h_m and l_m):
            continue
        w, h, length = int(w_m.group(1)), int(h_m.group(1)), int(l_m.group(1))
        if w < 32 or h < 32:
            continue
        raw = data[m.end() : m.end() + length]
        pages.append((w, h, raw))
    return pages


def crop_browser_chrome(img: Image.Image) -> Image.Image:
    w, h = img.size
    sample = img.crop((0, 0, w, min(120, h)))
    px = sample.load()
    gray_rows = 0
    for y in range(sample.size[1]):
        r, g, b = px[0, y]
        if abs(r - g) < 8 and abs(g - b) < 8 and 220 <= r <= 250:
            r2, g2, b2 = px[w // 2, y]
            if abs(r2 - r) < 12:
                gray_rows += 1
                continue
        break
    if 40 <= gray_rows <= 90:
        return img.crop((0, gray_rows, w, h))
    return img


class PdfBuilder:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.f = path.open("wb")
        self.offsets: list[int] = [0]
        self.f.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

    def obj(self, body: bytes) -> int:
        self.offsets.append(self.f.tell())
        n = len(self.offsets) - 1
        self.f.write(f"{n} 0 obj\n".encode("ascii"))
        self.f.write(body)
        if not body.endswith(b"\n"):
            self.f.write(b"\n")
        self.f.write(b"endobj\n")
        return n

    def stream_obj(self, dict_body: bytes, stream: bytes) -> int:
        self.offsets.append(self.f.tell())
        n = len(self.offsets) - 1
        self.f.write(f"{n} 0 obj\n".encode("ascii"))
        self.f.write(b"<< ")
        self.f.write(dict_body)
        self.f.write(f" /Length {len(stream)} >>\nstream\n".encode("ascii"))
        self.f.write(stream)
        self.f.write(b"\nendstream\nendobj\n")
        return n

    def close(self, catalog: int, info: int) -> None:
        xref_pos = self.f.tell()
        n = len(self.offsets)
        self.f.write(f"xref\n0 {n}\n".encode("ascii"))
        self.f.write(b"0000000000 65535 f \n")
        for off in self.offsets[1:]:
            self.f.write(f"{off:010d} 00000 n \n".encode("ascii"))
        self.f.write(
            (
                f"trailer\n<< /Size {n} /Root {catalog} 0 R /Info {info} 0 R >>\n"
                f"startxref\n{xref_pos}\n%%EOF\n"
            ).encode("ascii")
        )
        self.f.close()


def write_pdf(pages: list[Image.Image], dest: Path) -> int:
    b = PdfBuilder(dest)
    info = b.obj(
        b"<< /Title (Emendas Parlamentares - Rondonia) "
        b"/Author (Portal da Transparencia) "
        b"/Creator (Emendas Leve) /Producer (Emendas Leve) >>"
    )
    stored: list[tuple[int, int, float, float]] = []
    for img in pages:
        pal_img = img if img.mode == "P" else img.convert("P", palette=Image.ADAPTIVE, colors=256)
        w, h = pal_img.size
        palette = bytes(pal_img.getpalette()[:768]).ljust(768, b"\x00")
        compressed = zlib.compress(pal_img.tobytes(), 9)
        page_w = PAGE_PT_W
        page_h = round(PAGE_PT_W * h / w, 3)
        img_id = b.stream_obj(
            (
                b"/Type /XObject /Subtype /Image "
                + f"/Width {w} /Height {h} /BitsPerComponent 8 ".encode("ascii")
                + b"/ColorSpace [/Indexed /DeviceRGB 255 <"
                + palette.hex().upper().encode("ascii")
                + b">] /Filter /FlateDecode"
            ),
            compressed,
        )
        contents = f"q\n{page_w:.3f} 0 0 {page_h:.3f} 0 0 cm\n/Im0 Do\nQ\n".encode("ascii")
        c_id = b.stream_obj(b"", contents)
        stored.append((img_id, c_id, page_w, page_h))

    pages_obj_id = len(b.offsets) + len(stored)
    real_page_ids: list[int] = []
    for img_id, c_id, page_w, page_h in stored:
        pid = b.obj(
            (
                f"<< /Type /Page /Parent {pages_obj_id} 0 R "
                f"/MediaBox [0 0 {page_w:.3f} {page_h:.3f}] "
                f"/Resources << /XObject << /Im0 {img_id} 0 R >> >> "
                f"/Contents {c_id} 0 R >>"
            ).encode("ascii")
        )
        real_page_ids.append(pid)
    if len(b.offsets) != pages_obj_id:
        raise RuntimeError(f"pages id mismatch {len(b.offsets)} != {pages_obj_id}")
    kids = " ".join(f"{pid} 0 R" for pid in real_page_ids)
    pages_written = b.obj(
        f"<< /Type /Pages /Count {len(real_page_ids)} /Kids [ {kids} ] >>".encode("ascii")
    )
    if pages_written != pages_obj_id:
        raise RuntimeError(f"pages written {pages_written} != {pages_obj_id}")
    catalog = b.obj(f"<< /Type /Catalog /Pages {pages_written} 0 R >>".encode("ascii"))
    b.close(catalog, info)
    return dest.stat().st_size


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ART_PDF.parent.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("p*-t*.webp"):
        old.unlink()
    for old in OUT_DIR.glob("thumb-*.jpg"):
        old.unlink()

    data = SRC.read_bytes()
    extracted = parse_pdf_images(data)
    if len(extracted) != 17:
        raise SystemExit(f"expected 17 page images, got {len(extracted)}")

    orig_bytes = SRC.stat().st_size
    pdf_pages: list[Image.Image] = []
    manifest_pages = []
    tile_bytes = 0
    thumb_bytes = 0

    for i, (w, h, raw) in enumerate(extracted, start=1):
        dec = zlib.decompress(raw)
        expected = w * h * 3
        if len(dec) != expected:
            raise SystemExit(f"page {i}: decoded {len(dec)} != {expected}")
        img = Image.frombytes("RGB", (w, h), dec)
        img = crop_browser_chrome(img)
        w, h = img.size
        print(f"page {i:02d}  {w}x{h}", flush=True)

        tiles = []
        y = 0
        t = 0
        while y < h:
            th = min(TILE_H, h - y)
            tile = img.crop((0, y, w, y + th))
            name = f"p{i:02d}-t{t:02d}.webp"
            dest = OUT_DIR / name
            tile.save(dest, "WEBP", lossless=True, method=4, exact=True)
            sz = dest.stat().st_size
            tile_bytes += sz
            tiles.append({"src": f"/doc/{name}", "height": th, "bytes": sz})
            y += th
            t += 1

        top = img.crop((0, 0, w, min(h, int(w * 1.35))))
        top = top.resize(
            (220, max(1, int(220 * top.size[1] / top.size[0]))),
            Image.Resampling.LANCZOS,
        )
        tname = f"thumb-{i:02d}.jpg"
        top.save(OUT_DIR / tname, "JPEG", quality=72, optimize=True)
        thumb_bytes += (OUT_DIR / tname).stat().st_size

        pdf_pages.append(img.convert("P", palette=Image.ADAPTIVE, colors=256))
        manifest_pages.append(
            {
                "id": i,
                "width": w,
                "height": h,
                "thumb": f"/doc/{tname}",
                "tiles": tiles,
            }
        )
        img.close()

    pdf_size = write_pdf(pdf_pages, PDF_OUT)
    ART_PDF.write_bytes(PDF_OUT.read_bytes())
    for p in pdf_pages:
        p.close()

    manifest = {
        "title": "Emendas Parlamentares Recebidas do Estado de Rondônia",
        "source": "Portal da Transparência — Estado de Rondônia",
        "pageCount": 17,
        "originalBytes": orig_bytes,
        "webpBytes": tile_bytes,
        "thumbBytes": thumb_bytes,
        "pdfBytes": pdf_size,
        "pdfHref": "/emendas-rondonia-leve.pdf",
        "pages": manifest_pages,
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print("original", orig_bytes)
    print("webp", tile_bytes)
    print("pdf", pdf_size)
    print("thumbs", thumb_bytes)
    print("ratio pdf", round(pdf_size / orig_bytes, 3))
    print("ratio webp", round(tile_bytes / orig_bytes, 3))


if __name__ == "__main__":
    main()
