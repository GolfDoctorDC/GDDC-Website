import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { SITE } from "@/lib/site";

// Prefer CJS satori (harfbuzz needs __dirname). Fall back to ESM if require fails
// after the bundler inlines the package.
const require = createRequire(import.meta.url);
async function loadSatori(): Promise<typeof import("satori").default> {
  // Dynamic import so Nitro inlines satori into the serverless bundle.
  const mod = await import("satori");
  return (mod.default ?? mod) as typeof import("satori").default;
}

let wasmReady: Promise<void> | null = null;

async function ensureResvgWasm() {
  if (!wasmReady) {
    wasmReady = (async () => {
      const { join } = await import("node:path");
      const candidates = [
        join(process.cwd(), "public/resvg.wasm"),
        join(process.cwd(), "node_modules/@resvg/resvg-wasm/index_bg.wasm"),
      ];
      try {
        candidates.unshift(require.resolve("@resvg/resvg-wasm/index_bg.wasm"));
      } catch {
        /* package path unavailable after bundle */
      }
      let bytes: Buffer | ArrayBuffer | null = null;
      for (const path of candidates) {
        try {
          bytes = await readFile(path);
          break;
        } catch {
          /* try next */
        }
      }
      if (!bytes) {
        const res = await fetch("https://golfdoctordc.com/resvg.wasm");
        if (!res.ok) throw new Error(`resvg.wasm HTTP ${res.status}`);
        bytes = await res.arrayBuffer();
      }
      await initWasm(bytes);
    })();
  }
  await wasmReady;
}

export type GiftCardImageInput = {
  amount: string;
  fromName: string;
  recipientName: string;
  message: string;
  code: string;
};

const WIDTH = 1120;
const HEIGHT = 640;

const FOREST = "#163028";
const FOREST_FG = "#f4f0e6";
const FOREST_DEEP = "#0e1a14";
const CLAY = "#c45c12";

type FontCache = {
  outfitRegular: ArrayBuffer;
  outfitSemiBold: ArrayBuffer;
  display: ArrayBuffer;
  displayItalic: ArrayBuffer;
  mono: ArrayBuffer;
  backgroundDataUrl: string;
};

let assetsPromise: Promise<FontCache> | null = null;

const SITE_ORIGIN = "https://golfdoctordc.com";

const FONT_FILES = {
  outfitRegular: "Outfit-Regular.ttf",
  outfitSemiBold: "Outfit-SemiBold.ttf",
  display: "CormorantGaramond-SemiBold.ttf",
  displayItalic: "CormorantGaramond-SemiBoldItalic.ttf",
  mono: "IBMPlexMono-Medium.ttf",
} as const;

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength,
  ) as ArrayBuffer;
}

async function readFileIfExists(path: string): Promise<Buffer | null> {
  try {
    return await readFile(path);
  } catch {
    return null;
  }
}

async function loadBinary(pathHints: string[], url: string): Promise<ArrayBuffer> {
  // Prefer HTTP on Vercel — public/ is on the CDN, not the function filesystem.
  try {
    const res = await fetch(url);
    if (res.ok) return res.arrayBuffer();
  } catch {
    /* fall through to local files (dev) */
  }
  const { join } = await import("node:path");
  for (const hint of pathHints) {
    const buf = await readFileIfExists(join(process.cwd(), hint));
    if (buf) return toArrayBuffer(buf);
  }
  throw new Error(`Could not load ${url}`);
}

async function loadBackgroundDataUrl(): Promise<string> {
  try {
    const res = await fetch(`${SITE_ORIGIN}/images/gift-card.jpg`);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    }
  } catch {
    /* local fallback for offline/dev */
  }
  const { join } = await import("node:path");
  const local = await readFileIfExists(
    join(process.cwd(), "public/images/gift-card.jpg"),
  );
  if (local) return `data:image/jpeg;base64,${local.toString("base64")}`;
  throw new Error("Could not load gift-card.jpg");
}

async function loadFont(fileName: string): Promise<ArrayBuffer> {
  return loadBinary(
    [`public/fonts/${fileName}`],
    `${SITE_ORIGIN}/fonts/${fileName}`,
  );
}

async function loadAssets(): Promise<FontCache> {
  const [
    outfitRegular,
    outfitSemiBold,
    display,
    displayItalic,
    mono,
    backgroundDataUrl,
  ] = await Promise.all([
    loadFont(FONT_FILES.outfitRegular),
    loadFont(FONT_FILES.outfitSemiBold),
    loadFont(FONT_FILES.display),
    loadFont(FONT_FILES.displayItalic),
    loadFont(FONT_FILES.mono),
    loadBackgroundDataUrl(),
  ]);
  return {
    outfitRegular,
    outfitSemiBold,
    display,
    displayItalic,
    mono,
    backgroundDataUrl,
  };
}

function assets() {
  if (!assetsPromise) assetsPromise = loadAssets();
  return assetsPromise;
}

function cardMarkup(input: GiftCardImageInput, backgroundDataUrl: string) {
  const who = input.recipientName.trim()
    ? `For ${input.recipientName.trim()}`
    : "For a golfer";
  const from = input.fromName.trim() ? `From ${input.fromName.trim()}` : "";
  const message = input.message.trim();
  const dollars = input.amount.trim() || "—";

  return {
    type: "div",
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        borderRadius: 32,
        backgroundColor: FOREST,
        color: FOREST_FG,
        fontFamily: "Outfit",
      },
      children: [
        {
          type: "img",
          props: {
            src: backgroundDataUrl,
            width: WIDTH,
            height: HEIGHT,
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              objectFit: "cover",
              opacity: 0.35,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              display: "flex",
              backgroundImage: `linear-gradient(135deg, ${FOREST}eb 0%, ${FOREST}d6 45%, ${FOREST_DEEP}eb 100%)`,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              padding: 56,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column" },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                fontSize: 18,
                                fontWeight: 600,
                                letterSpacing: "0.28em",
                                textTransform: "uppercase",
                                color: CLAY,
                              },
                              children: "Digital gift card",
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                marginTop: 12,
                                fontFamily: "Cormorant Garamond",
                                fontSize: 56,
                                fontWeight: 600,
                                lineHeight: 1,
                              },
                              children: SITE.shortName,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          fontFamily: "Cormorant Garamond",
                          fontSize: 72,
                          fontWeight: 600,
                          lineHeight: 1,
                        },
                        children: dollars,
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    marginTop: 36,
                    fontSize: 24,
                    color: "rgba(244, 240, 230, 0.8)",
                  },
                  children: from
                    ? [
                        { type: "span", props: { children: who } },
                        {
                          type: "span",
                          props: {
                            style: { color: "rgba(244, 240, 230, 0.5)" },
                            children: ` · ${from}`,
                          },
                        },
                      ]
                    : who,
                },
              },
              message
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 18,
                        maxWidth: 760,
                        fontFamily: "Cormorant Garamond",
                        fontSize: 40,
                        fontStyle: "italic",
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: FOREST_FG,
                      },
                      children: `“${message}”`,
                    },
                  }
                : {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginTop: 18,
                        maxWidth: 640,
                        fontSize: 22,
                        lineHeight: 1.45,
                        color: "rgba(244, 240, 230, 0.7)",
                      },
                      children:
                        "Fittings, simulator time, and shop work at the K Street studio.",
                    },
                  },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    marginTop: "auto",
                    paddingTop: 28,
                    borderTop: "1px solid rgba(244, 240, 230, 0.15)",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: "100%",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column" },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                fontSize: 14,
                                fontWeight: 600,
                                letterSpacing: "0.22em",
                                textTransform: "uppercase",
                                color: "rgba(244, 240, 230, 0.55)",
                              },
                              children: "Redemption code",
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                marginTop: 8,
                                fontFamily: "IBM Plex Mono",
                                fontSize: 28,
                                letterSpacing: "0.18em",
                              },
                              children: input.code,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          fontSize: 18,
                          lineHeight: 1.45,
                          color: "rgba(244, 240, 230, 0.7)",
                          textAlign: "right",
                        },
                        children: [
                          { type: "div", props: { children: SITE.tagline } },
                          {
                            type: "div",
                            props: { children: SITE.address.line1 },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export async function renderGiftCardPng(
  input: GiftCardImageInput,
): Promise<Buffer> {
  const [loaded, satori] = await Promise.all([assets(), loadSatori()]);
  await ensureResvgWasm();
  const svg = await satori(cardMarkup(input, loaded.backgroundDataUrl) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Outfit",
        data: loaded.outfitRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Outfit",
        data: loaded.outfitSemiBold,
        weight: 600,
        style: "normal",
      },
      {
        name: "Cormorant Garamond",
        data: loaded.display,
        weight: 600,
        style: "normal",
      },
      {
        name: "Cormorant Garamond",
        data: loaded.displayItalic,
        weight: 600,
        style: "italic",
      },
      {
        name: "IBM Plex Mono",
        data: loaded.mono,
        weight: 500,
        style: "normal",
      },
    ],
  });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  return Buffer.from(resvg.render().asPng());
}

export function giftCardImageUrl(code: string) {
  return `https://golfdoctordc.com/gift-cards/${encodeURIComponent(code)}.png`;
}
