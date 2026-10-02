import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Maximize2, c as ChevronLeft, i as Minus, n as Rows3, o as Download, r as Plus, s as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CC1aXwQ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function clampZoom(value) {
	return Math.min(5, Math.max(1, Math.round(value * 20) / 20));
}
/** Zoom that paints the page at ~1 CSS pixel per source pixel (readable text). */
function nativeZoom(viewWidth, pageWidth) {
	if (viewWidth <= 0) return 1;
	return clampZoom(pageWidth / viewWidth);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	const kb = bytes / 1024;
	if (kb < 1024) return `${(kb >= 100 ? kb.toFixed(0) : kb.toFixed(1)).replace(".", ",")} KB`;
	return `${(kb / 1024).toFixed(1).replace(".", ",")} MB`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-navy text-paper hover:bg-navy-deep",
			cyan: "bg-cyan text-paper hover:bg-cyan/90",
			outline: "border border-line bg-surface text-ink hover:bg-paper-deep",
			ghost: "text-ink-soft hover:bg-paper-deep hover:text-ink",
			inverse: "bg-paper text-navy-deep hover:bg-paper-deep"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function touchDistance(a, b) {
	return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
function EmendaReader({ doc }) {
	const scrollerRef = (0, import_react.useRef)(null);
	const pinchRef = (0, import_react.useRef)(null);
	const lastTapRef = (0, import_react.useRef)(0);
	const pageRef = (0, import_react.useRef)(1);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [page, setPage] = (0, import_react.useState)(1);
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const zoomRef = (0, import_react.useRef)(zoom);
	zoomRef.current = zoom;
	pageRef.current = page;
	const centerAfterZoomRef = (0, import_react.useRef)(false);
	const pageWidth = doc.pages[0]?.width ?? 1311;
	const centerHorizontally = (0, import_react.useCallback)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
	}, []);
	const applyZoom = (0, import_react.useCallback)((next, origin, centerX = false) => {
		const el = scrollerRef.current;
		const z = clampZoom(next);
		const prev = zoomRef.current;
		if (!el) {
			setZoom(z);
			return;
		}
		const ox = origin?.x ?? el.clientWidth / 2;
		const oy = origin?.y ?? el.clientHeight / 2;
		const ratio = z / prev;
		const sl = (el.scrollLeft + ox) * ratio - ox;
		const st = (el.scrollTop + oy) * ratio - oy;
		setZoom(z);
		if (centerX) centerAfterZoomRef.current = true;
		requestAnimationFrame(() => {
			if (centerAfterZoomRef.current) {
				centerHorizontally();
				centerAfterZoomRef.current = false;
			} else el.scrollLeft = sl;
			el.scrollTop = st;
		});
	}, [centerHorizontally]);
	const goReadMode = (0, import_react.useCallback)(() => {
		const el = scrollerRef.current;
		const z = nativeZoom(el?.clientWidth ?? 390, pageWidth);
		applyZoom(z, void 0, true);
	}, [applyZoom, pageWidth]);
	const goPage = (0, import_react.useCallback)((id) => {
		const next = Math.min(doc.pageCount, Math.max(1, id));
		(scrollerRef.current?.querySelector(`[data-page="${next}"]`))?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
		requestAnimationFrame(centerHorizontally);
		setPage(next);
		setPickerOpen(false);
	}, [centerHorizontally, doc.pageCount]);
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (window.innerWidth >= 900) setZoom(1);
		else {
			const z = nativeZoom(el?.clientWidth ?? window.innerWidth, pageWidth);
			centerAfterZoomRef.current = true;
			setZoom(z);
		}
		setReady(true);
	}, [pageWidth]);
	(0, import_react.useLayoutEffect)(() => {
		if (!centerAfterZoomRef.current) return;
		centerHorizontally();
		centerAfterZoomRef.current = false;
	}, [zoom, centerHorizontally]);
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const pages = Array.from(el.querySelectorAll("[data-page]"));
		const io = new IntersectionObserver((entries) => {
			const id = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]?.target.getAttribute("data-page");
			if (id) setPage(Number(id));
		}, {
			root: el,
			threshold: [
				.12,
				.28,
				.5
			]
		});
		pages.forEach((node) => io.observe(node));
		return () => io.disconnect();
	}, [doc.pages.length]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "+" || e.key === "=") applyZoom(zoomRef.current + .2);
			if (e.key === "-" || e.key === "_") applyZoom(zoomRef.current - .2);
			if (e.key === "0") applyZoom(1, void 0, true);
			if (e.key === "ArrowRight") goPage(pageRef.current + 1);
			if (e.key === "ArrowLeft") goPage(pageRef.current - 1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [applyZoom, goPage]);
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const onStart = (e) => {
			if (e.touches.length === 2) {
				pinchRef.current = {
					startDist: touchDistance(e.touches[0], e.touches[1]),
					startZoom: zoomRef.current
				};
				return;
			}
			if (e.touches.length === 1) {
				const now = Date.now();
				if (now - lastTapRef.current < 280) {
					const r = el.getBoundingClientRect();
					const reading = nativeZoom(el.clientWidth, pageWidth);
					const target = zoomRef.current > 1.3 ? 1 : reading;
					applyZoom(target, {
						x: e.touches[0].clientX - r.left,
						y: e.touches[0].clientY - r.top
					}, target > 1.3);
				}
				lastTapRef.current = now;
			}
		};
		const onMove = (e) => {
			if (e.touches.length !== 2 || !pinchRef.current) return;
			e.preventDefault();
			const factor = touchDistance(e.touches[0], e.touches[1]) / pinchRef.current.startDist;
			const r = el.getBoundingClientRect();
			applyZoom(pinchRef.current.startZoom * factor, {
				x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left,
				y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top
			});
		};
		const onEnd = () => {
			pinchRef.current = null;
		};
		el.addEventListener("touchstart", onStart, { passive: true });
		el.addEventListener("touchmove", onMove, { passive: false });
		el.addEventListener("touchend", onEnd);
		el.addEventListener("touchcancel", onEnd);
		return () => {
			el.removeEventListener("touchstart", onStart);
			el.removeEventListener("touchmove", onMove);
			el.removeEventListener("touchend", onEnd);
			el.removeEventListener("touchcancel", onEnd);
		};
	}, [applyZoom, pageWidth]);
	const pct = Math.round((1 - doc.pdfBytes / doc.originalBytes) * 100);
	const readLevel = nativeZoom(scrollerRef.current?.clientWidth ?? 390, pageWidth);
	const isRead = Math.abs(zoom - readLevel) < .15;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "relative z-20 shrink-0 bg-navy text-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-3 py-2.5 safe-pt",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-sm bg-navy-deep text-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookMark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-medium leading-tight tracking-tight",
								children: "Emendas Leve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs tabular-nums text-paper/70",
								children: [
									formatBytes(doc.originalBytes),
									" → ",
									formatBytes(doc.pdfBytes),
									" · −",
									pct,
									"% ·",
									" ",
									doc.pageCount,
									" pág."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "inverse",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: doc.pdfHref,
								download: "emendas-rondonia-leve.pdf",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "PDF"]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scrollerRef,
					className: "h-full overflow-auto overscroll-contain bg-paper-deep",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("origin-top", !ready && "doc-canvas"),
						style: ready ? { width: `${zoom * 100}%` } : void 0,
						children: doc.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							"data-page": p.id,
							className: "border-b border-line bg-surface",
							children: p.tiles.map((tile, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: tile.src,
								alt: idx === 0 ? `Página ${p.id} de ${doc.pageCount}` : `Página ${p.id}, continuação ${idx + 1}`,
								width: p.width,
								height: tile.height,
								loading: p.id === 1 && idx < 3 ? "eager" : "lazy",
								decoding: "async",
								draggable: false,
								className: "block w-full select-none"
							}, tile.src))
						}, p.id))
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "safe-pb shrink-0 border-t border-line bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-0.5 px-1 py-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Página anterior",
							onClick: () => goPage(page - 1),
							disabled: page <= 1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPickerOpen((v) => !v),
							className: "min-w-12 rounded-sm px-1 py-2 text-center text-xs font-medium tabular-nums text-ink-soft hover:bg-paper-deep",
							children: [
								page,
								"/",
								doc.pageCount
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Próxima página",
							onClick: () => goPage(page + 1),
							disabled: page >= doc.pageCount,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-5 w-px bg-line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Reduzir zoom",
							onClick: () => applyZoom(zoom - .25),
							disabled: zoom <= 1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-10 text-center text-xs font-medium tabular-nums text-ink-soft",
							children: [Math.round(zoom * 100), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							"aria-label": "Aumentar zoom",
							onClick: () => applyZoom(zoom + .25),
							disabled: zoom >= 5,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: zoom === 1 ? "outline" : "ghost",
							size: "icon-sm",
							className: "hidden sm:inline-flex",
							"aria-label": "Ajustar à largura",
							onClick: () => applyZoom(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: isRead ? "outline" : "ghost",
							size: "sm",
							onClick: goReadMode,
							children: "Ler"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: pickerOpen ? "outline" : "ghost",
							size: "icon-sm",
							"aria-label": "Índice de páginas",
							className: "ml-auto",
							onClick: () => setPickerOpen((v) => !v),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows3, {})
						})
					]
				}), pickerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto px-3 pb-3",
					children: doc.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => goPage(p.id),
						className: cn("relative w-16 shrink-0 overflow-hidden rounded-sm border transition-[border-color,transform] duration-150", page === p.id ? "border-cyan ring-2 ring-cyan/30" : "border-line"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.thumb,
							alt: `Ir para página ${p.id}`,
							className: "block aspect-3/4 w-full object-cover object-top"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-0 bottom-0 bg-ink/70 py-0.5 text-center text-2xs tabular-nums text-paper",
							children: p.id
						})]
					}, p.id))
				}) : null]
			})
		]
	});
}
function BookMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 20 20",
		className: "size-4",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M5 2.5h10a1 1 0 0 1 1 1V17l-6-2.8L4 17V3.5a1 1 0 0 1 1-1Z"
		})
	});
}
var doc_manifest_default = {
	title: "Emendas Parlamentares Recebidas do Estado de Rondônia",
	source: "Portal da Transparência — Estado de Rondônia",
	pageCount: 17,
	originalBytes: 22194344,
	webpBytes: 7404992,
	thumbBytes: 130437,
	pdfBytes: 9307016,
	pdfHref: "/emendas-rondonia-leve.pdf",
	pages: [
		{
			"id": 1,
			"width": 1311,
			"height": 11561,
			"thumb": "/doc/thumb-01.jpg",
			"tiles": [
				{
					"src": "/doc/p01-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p01-t01.webp",
					"height": 1280,
					"bytes": 46808
				},
				{
					"src": "/doc/p01-t02.webp",
					"height": 1280,
					"bytes": 51550
				},
				{
					"src": "/doc/p01-t03.webp",
					"height": 1280,
					"bytes": 53032
				},
				{
					"src": "/doc/p01-t04.webp",
					"height": 1280,
					"bytes": 49228
				},
				{
					"src": "/doc/p01-t05.webp",
					"height": 1280,
					"bytes": 51602
				},
				{
					"src": "/doc/p01-t06.webp",
					"height": 1280,
					"bytes": 50404
				},
				{
					"src": "/doc/p01-t07.webp",
					"height": 1280,
					"bytes": 52096
				},
				{
					"src": "/doc/p01-t08.webp",
					"height": 1280,
					"bytes": 55004
				},
				{
					"src": "/doc/p01-t09.webp",
					"height": 41,
					"bytes": 3530
				}
			]
		},
		{
			"id": 2,
			"width": 1311,
			"height": 11646,
			"thumb": "/doc/thumb-02.jpg",
			"tiles": [
				{
					"src": "/doc/p02-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p02-t01.webp",
					"height": 1280,
					"bytes": 47552
				},
				{
					"src": "/doc/p02-t02.webp",
					"height": 1280,
					"bytes": 49720
				},
				{
					"src": "/doc/p02-t03.webp",
					"height": 1280,
					"bytes": 50960
				},
				{
					"src": "/doc/p02-t04.webp",
					"height": 1280,
					"bytes": 54970
				},
				{
					"src": "/doc/p02-t05.webp",
					"height": 1280,
					"bytes": 48560
				},
				{
					"src": "/doc/p02-t06.webp",
					"height": 1280,
					"bytes": 51910
				},
				{
					"src": "/doc/p02-t07.webp",
					"height": 1280,
					"bytes": 55018
				},
				{
					"src": "/doc/p02-t08.webp",
					"height": 1280,
					"bytes": 52490
				},
				{
					"src": "/doc/p02-t09.webp",
					"height": 126,
					"bytes": 9190
				}
			]
		},
		{
			"id": 3,
			"width": 1311,
			"height": 11503,
			"thumb": "/doc/thumb-03.jpg",
			"tiles": [
				{
					"src": "/doc/p03-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p03-t01.webp",
					"height": 1280,
					"bytes": 46046
				},
				{
					"src": "/doc/p03-t02.webp",
					"height": 1280,
					"bytes": 51372
				},
				{
					"src": "/doc/p03-t03.webp",
					"height": 1280,
					"bytes": 52610
				},
				{
					"src": "/doc/p03-t04.webp",
					"height": 1280,
					"bytes": 50834
				},
				{
					"src": "/doc/p03-t05.webp",
					"height": 1280,
					"bytes": 46920
				},
				{
					"src": "/doc/p03-t06.webp",
					"height": 1280,
					"bytes": 52430
				},
				{
					"src": "/doc/p03-t07.webp",
					"height": 1280,
					"bytes": 50716
				},
				{
					"src": "/doc/p03-t08.webp",
					"height": 1263,
					"bytes": 55020
				}
			]
		},
		{
			"id": 4,
			"width": 1311,
			"height": 11334,
			"thumb": "/doc/thumb-04.jpg",
			"tiles": [
				{
					"src": "/doc/p04-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p04-t01.webp",
					"height": 1280,
					"bytes": 47306
				},
				{
					"src": "/doc/p04-t02.webp",
					"height": 1280,
					"bytes": 51592
				},
				{
					"src": "/doc/p04-t03.webp",
					"height": 1280,
					"bytes": 51020
				},
				{
					"src": "/doc/p04-t04.webp",
					"height": 1280,
					"bytes": 45060
				},
				{
					"src": "/doc/p04-t05.webp",
					"height": 1280,
					"bytes": 52792
				},
				{
					"src": "/doc/p04-t06.webp",
					"height": 1280,
					"bytes": 49378
				},
				{
					"src": "/doc/p04-t07.webp",
					"height": 1280,
					"bytes": 45916
				},
				{
					"src": "/doc/p04-t08.webp",
					"height": 1094,
					"bytes": 51646
				}
			]
		},
		{
			"id": 5,
			"width": 1311,
			"height": 11532,
			"thumb": "/doc/thumb-05.jpg",
			"tiles": [
				{
					"src": "/doc/p05-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p05-t01.webp",
					"height": 1280,
					"bytes": 48526
				},
				{
					"src": "/doc/p05-t02.webp",
					"height": 1280,
					"bytes": 52878
				},
				{
					"src": "/doc/p05-t03.webp",
					"height": 1280,
					"bytes": 50720
				},
				{
					"src": "/doc/p05-t04.webp",
					"height": 1280,
					"bytes": 53208
				},
				{
					"src": "/doc/p05-t05.webp",
					"height": 1280,
					"bytes": 49282
				},
				{
					"src": "/doc/p05-t06.webp",
					"height": 1280,
					"bytes": 50420
				},
				{
					"src": "/doc/p05-t07.webp",
					"height": 1280,
					"bytes": 52394
				},
				{
					"src": "/doc/p05-t08.webp",
					"height": 1280,
					"bytes": 57098
				},
				{
					"src": "/doc/p05-t09.webp",
					"height": 12,
					"bytes": 44
				}
			]
		},
		{
			"id": 6,
			"width": 1311,
			"height": 11617,
			"thumb": "/doc/thumb-06.jpg",
			"tiles": [
				{
					"src": "/doc/p06-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p06-t01.webp",
					"height": 1280,
					"bytes": 46432
				},
				{
					"src": "/doc/p06-t02.webp",
					"height": 1280,
					"bytes": 57992
				},
				{
					"src": "/doc/p06-t03.webp",
					"height": 1280,
					"bytes": 47976
				},
				{
					"src": "/doc/p06-t04.webp",
					"height": 1280,
					"bytes": 55480
				},
				{
					"src": "/doc/p06-t05.webp",
					"height": 1280,
					"bytes": 44606
				},
				{
					"src": "/doc/p06-t06.webp",
					"height": 1280,
					"bytes": 52096
				},
				{
					"src": "/doc/p06-t07.webp",
					"height": 1280,
					"bytes": 51294
				},
				{
					"src": "/doc/p06-t08.webp",
					"height": 1280,
					"bytes": 52442
				},
				{
					"src": "/doc/p06-t09.webp",
					"height": 97,
					"bytes": 9722
				}
			]
		},
		{
			"id": 7,
			"width": 1311,
			"height": 11503,
			"thumb": "/doc/thumb-07.jpg",
			"tiles": [
				{
					"src": "/doc/p07-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p07-t01.webp",
					"height": 1280,
					"bytes": 45780
				},
				{
					"src": "/doc/p07-t02.webp",
					"height": 1280,
					"bytes": 54980
				},
				{
					"src": "/doc/p07-t03.webp",
					"height": 1280,
					"bytes": 52106
				},
				{
					"src": "/doc/p07-t04.webp",
					"height": 1280,
					"bytes": 48928
				},
				{
					"src": "/doc/p07-t05.webp",
					"height": 1280,
					"bytes": 50528
				},
				{
					"src": "/doc/p07-t06.webp",
					"height": 1280,
					"bytes": 49586
				},
				{
					"src": "/doc/p07-t07.webp",
					"height": 1280,
					"bytes": 47460
				},
				{
					"src": "/doc/p07-t08.webp",
					"height": 1263,
					"bytes": 61512
				}
			]
		},
		{
			"id": 8,
			"width": 1311,
			"height": 11306,
			"thumb": "/doc/thumb-08.jpg",
			"tiles": [
				{
					"src": "/doc/p08-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p08-t01.webp",
					"height": 1280,
					"bytes": 49260
				},
				{
					"src": "/doc/p08-t02.webp",
					"height": 1280,
					"bytes": 50166
				},
				{
					"src": "/doc/p08-t03.webp",
					"height": 1280,
					"bytes": 53814
				},
				{
					"src": "/doc/p08-t04.webp",
					"height": 1280,
					"bytes": 46514
				},
				{
					"src": "/doc/p08-t05.webp",
					"height": 1280,
					"bytes": 48964
				},
				{
					"src": "/doc/p08-t06.webp",
					"height": 1280,
					"bytes": 48424
				},
				{
					"src": "/doc/p08-t07.webp",
					"height": 1280,
					"bytes": 44724
				},
				{
					"src": "/doc/p08-t08.webp",
					"height": 1066,
					"bytes": 51126
				}
			]
		},
		{
			"id": 9,
			"width": 1311,
			"height": 3610,
			"thumb": "/doc/thumb-09.jpg",
			"tiles": [
				{
					"src": "/doc/p09-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p09-t01.webp",
					"height": 1280,
					"bytes": 49782
				},
				{
					"src": "/doc/p09-t02.webp",
					"height": 1050,
					"bytes": 53326
				}
			]
		},
		{
			"id": 10,
			"width": 1311,
			"height": 11476,
			"thumb": "/doc/thumb-10.jpg",
			"tiles": [
				{
					"src": "/doc/p10-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p10-t01.webp",
					"height": 1280,
					"bytes": 45368
				},
				{
					"src": "/doc/p10-t02.webp",
					"height": 1280,
					"bytes": 48486
				},
				{
					"src": "/doc/p10-t03.webp",
					"height": 1280,
					"bytes": 53696
				},
				{
					"src": "/doc/p10-t04.webp",
					"height": 1280,
					"bytes": 47320
				},
				{
					"src": "/doc/p10-t05.webp",
					"height": 1280,
					"bytes": 50058
				},
				{
					"src": "/doc/p10-t06.webp",
					"height": 1280,
					"bytes": 52490
				},
				{
					"src": "/doc/p10-t07.webp",
					"height": 1280,
					"bytes": 51080
				},
				{
					"src": "/doc/p10-t08.webp",
					"height": 1236,
					"bytes": 57710
				}
			]
		},
		{
			"id": 11,
			"width": 1311,
			"height": 11646,
			"thumb": "/doc/thumb-11.jpg",
			"tiles": [
				{
					"src": "/doc/p11-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p11-t01.webp",
					"height": 1280,
					"bytes": 47868
				},
				{
					"src": "/doc/p11-t02.webp",
					"height": 1280,
					"bytes": 52026
				},
				{
					"src": "/doc/p11-t03.webp",
					"height": 1280,
					"bytes": 54208
				},
				{
					"src": "/doc/p11-t04.webp",
					"height": 1280,
					"bytes": 53202
				},
				{
					"src": "/doc/p11-t05.webp",
					"height": 1280,
					"bytes": 48576
				},
				{
					"src": "/doc/p11-t06.webp",
					"height": 1280,
					"bytes": 53472
				},
				{
					"src": "/doc/p11-t07.webp",
					"height": 1280,
					"bytes": 55918
				},
				{
					"src": "/doc/p11-t08.webp",
					"height": 1280,
					"bytes": 46726
				},
				{
					"src": "/doc/p11-t09.webp",
					"height": 126,
					"bytes": 9200
				}
			]
		},
		{
			"id": 12,
			"width": 1311,
			"height": 11588,
			"thumb": "/doc/thumb-12.jpg",
			"tiles": [
				{
					"src": "/doc/p12-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p12-t01.webp",
					"height": 1280,
					"bytes": 51622
				},
				{
					"src": "/doc/p12-t02.webp",
					"height": 1280,
					"bytes": 53988
				},
				{
					"src": "/doc/p12-t03.webp",
					"height": 1280,
					"bytes": 49280
				},
				{
					"src": "/doc/p12-t04.webp",
					"height": 1280,
					"bytes": 53172
				},
				{
					"src": "/doc/p12-t05.webp",
					"height": 1280,
					"bytes": 48676
				},
				{
					"src": "/doc/p12-t06.webp",
					"height": 1280,
					"bytes": 49604
				},
				{
					"src": "/doc/p12-t07.webp",
					"height": 1280,
					"bytes": 54132
				},
				{
					"src": "/doc/p12-t08.webp",
					"height": 1280,
					"bytes": 57784
				},
				{
					"src": "/doc/p12-t09.webp",
					"height": 68,
					"bytes": 1906
				}
			]
		},
		{
			"id": 13,
			"width": 1311,
			"height": 11561,
			"thumb": "/doc/thumb-13.jpg",
			"tiles": [
				{
					"src": "/doc/p13-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p13-t01.webp",
					"height": 1280,
					"bytes": 48902
				},
				{
					"src": "/doc/p13-t02.webp",
					"height": 1280,
					"bytes": 54168
				},
				{
					"src": "/doc/p13-t03.webp",
					"height": 1280,
					"bytes": 51902
				},
				{
					"src": "/doc/p13-t04.webp",
					"height": 1280,
					"bytes": 52774
				},
				{
					"src": "/doc/p13-t05.webp",
					"height": 1280,
					"bytes": 50092
				},
				{
					"src": "/doc/p13-t06.webp",
					"height": 1280,
					"bytes": 51362
				},
				{
					"src": "/doc/p13-t07.webp",
					"height": 1280,
					"bytes": 52180
				},
				{
					"src": "/doc/p13-t08.webp",
					"height": 1280,
					"bytes": 57264
				},
				{
					"src": "/doc/p13-t09.webp",
					"height": 41,
					"bytes": 3518
				}
			]
		},
		{
			"id": 14,
			"width": 1311,
			"height": 11532,
			"thumb": "/doc/thumb-14.jpg",
			"tiles": [
				{
					"src": "/doc/p14-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p14-t01.webp",
					"height": 1280,
					"bytes": 48110
				},
				{
					"src": "/doc/p14-t02.webp",
					"height": 1280,
					"bytes": 53012
				},
				{
					"src": "/doc/p14-t03.webp",
					"height": 1280,
					"bytes": 51022
				},
				{
					"src": "/doc/p14-t04.webp",
					"height": 1280,
					"bytes": 48446
				},
				{
					"src": "/doc/p14-t05.webp",
					"height": 1280,
					"bytes": 50310
				},
				{
					"src": "/doc/p14-t06.webp",
					"height": 1280,
					"bytes": 52232
				},
				{
					"src": "/doc/p14-t07.webp",
					"height": 1280,
					"bytes": 52564
				},
				{
					"src": "/doc/p14-t08.webp",
					"height": 1280,
					"bytes": 57660
				},
				{
					"src": "/doc/p14-t09.webp",
					"height": 12,
					"bytes": 44
				}
			]
		},
		{
			"id": 15,
			"width": 1311,
			"height": 11503,
			"thumb": "/doc/thumb-15.jpg",
			"tiles": [
				{
					"src": "/doc/p15-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p15-t01.webp",
					"height": 1280,
					"bytes": 49488
				},
				{
					"src": "/doc/p15-t02.webp",
					"height": 1280,
					"bytes": 52624
				},
				{
					"src": "/doc/p15-t03.webp",
					"height": 1280,
					"bytes": 54410
				},
				{
					"src": "/doc/p15-t04.webp",
					"height": 1280,
					"bytes": 51446
				},
				{
					"src": "/doc/p15-t05.webp",
					"height": 1280,
					"bytes": 47464
				},
				{
					"src": "/doc/p15-t06.webp",
					"height": 1280,
					"bytes": 50210
				},
				{
					"src": "/doc/p15-t07.webp",
					"height": 1280,
					"bytes": 50692
				},
				{
					"src": "/doc/p15-t08.webp",
					"height": 1263,
					"bytes": 55674
				}
			]
		},
		{
			"id": 16,
			"width": 1311,
			"height": 11418,
			"thumb": "/doc/thumb-16.jpg",
			"tiles": [
				{
					"src": "/doc/p16-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p16-t01.webp",
					"height": 1280,
					"bytes": 47984
				},
				{
					"src": "/doc/p16-t02.webp",
					"height": 1280,
					"bytes": 50302
				},
				{
					"src": "/doc/p16-t03.webp",
					"height": 1280,
					"bytes": 52108
				},
				{
					"src": "/doc/p16-t04.webp",
					"height": 1280,
					"bytes": 48810
				},
				{
					"src": "/doc/p16-t05.webp",
					"height": 1280,
					"bytes": 51914
				},
				{
					"src": "/doc/p16-t06.webp",
					"height": 1280,
					"bytes": 49688
				},
				{
					"src": "/doc/p16-t07.webp",
					"height": 1280,
					"bytes": 50544
				},
				{
					"src": "/doc/p16-t08.webp",
					"height": 1178,
					"bytes": 54996
				}
			]
		},
		{
			"id": 17,
			"width": 1311,
			"height": 11503,
			"thumb": "/doc/thumb-17.jpg",
			"tiles": [
				{
					"src": "/doc/p17-t00.webp",
					"height": 1280,
					"bytes": 42044
				},
				{
					"src": "/doc/p17-t01.webp",
					"height": 1280,
					"bytes": 47552
				},
				{
					"src": "/doc/p17-t02.webp",
					"height": 1280,
					"bytes": 51928
				},
				{
					"src": "/doc/p17-t03.webp",
					"height": 1280,
					"bytes": 53682
				},
				{
					"src": "/doc/p17-t04.webp",
					"height": 1280,
					"bytes": 48812
				},
				{
					"src": "/doc/p17-t05.webp",
					"height": 1280,
					"bytes": 50742
				},
				{
					"src": "/doc/p17-t06.webp",
					"height": 1280,
					"bytes": 52204
				},
				{
					"src": "/doc/p17-t07.webp",
					"height": 1280,
					"bytes": 52012
				},
				{
					"src": "/doc/p17-t08.webp",
					"height": 1263,
					"bytes": 57956
				}
			]
		}
	]
};
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmendaReader, { doc: doc_manifest_default });
}
//#endregion
export { Home as component };
