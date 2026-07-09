// Static-site checks in a real browser: it loads clean, the hero 7-segment strip
// actually lights segments, links point where we claim, and nothing overflows
// horizontally on a phone. Screenshots land in .shots/ for eyeballing.
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const ROOT = new URL("../", import.meta.url).pathname;
const SHOTS = join(ROOT, ".shots");
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png",
};

const server = createServer(async (req, res) => {
  try {
    const rel = decodeURIComponent(req.url.split("?")[0]);
    const p = join(ROOT, normalize(rel === "/" ? "index.html" : rel).replace(/^(\.\.[/\\])+/, ""));
    const body = await readFile(p);
    res.setHeader("Content-Type", MIME[extname(p)] ?? "application/octet-stream");
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}/`;

let fail = 0;
const ok = (label, cond) => { console.log(`${cond ? "PASS" : "FAIL"}  ${label}`); if (!cond) fail++; };

// Licence files must exist and say what the footer/README claim they say.
const licence = await readFile(join(ROOT, "LICENSE"), "utf8").catch(() => "");
const content = await readFile(join(ROOT, "LICENSE-CONTENT"), "utf8").catch(() => "");
const notice = await readFile(join(ROOT, "NOTICE"), "utf8").catch(() => "");
ok("LICENSE is MIT", /MIT License/.test(licence));
// Keep LICENSE as the *unmodified* MIT text: appended scope notes make GitHub /
// SPDX scanners report NOASSERTION instead of MIT. Scope lives in NOTICE.
ok("LICENSE has no appended scope text (keeps licence detection working)",
  !/all rights reserved|LICENSE-CONTENT|Scope\./i.test(licence));
ok("LICENSE-CONTENT is CC BY-SA 4.0", /Attribution-ShareAlike 4\.0 International/.test(content));
ok("NOTICE carves the brand out of both licences",
  /all rights reserved/i.test(notice) && /calcumaker-mark\.svg/.test(notice));
ok("NOTICE names each brand asset that ships",
  ["calcumaker-logo.svg", "calcumaker-mark.png", "calcumaker-mark.svg", "favicon.svg", "apple-touch-icon.png"]
    .every((f) => notice.includes(f)));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()}`));

await page.goto(base, { waitUntil: "networkidle" });

// Core content
ok("has an h1", (await page.locator("h1").count()) === 1);
ok("title mentions Calcumaker", (await page.title()).includes("Calcumaker"));
ok("meta description present",
  ((await page.locator('meta[name="description"]').getAttribute("content")) ?? "").length > 50);
ok("og:image set", !!(await page.locator('meta[property="og:image"]').getAttribute("content")));

// The hero 7-seg strip really renders and lights segments (not a dead <svg>).
await page.waitForSelector("#segdisplay .seg.on");
const segs = await page.locator("#segdisplay .seg").count();
const lit = await page.locator("#segdisplay .seg.on").count();
ok(`7-seg strip built (${segs} segments = 16 cells x 8)`, segs === 16 * 8);
ok(`7-seg strip is lit (${lit} segments on)`, lit > 10);

// Status honesty: we must not imply it's purchasable.
const body = (await page.locator("body").innerText()).toLowerCase();
ok("states project status", body.includes("work in progress"));
ok("does not claim it's for sale", body.includes("nothing is for sale"));

// Branding: the marks must render (SVGs silently fail as empty boxes).
const brandOk = await page.evaluate(() => {
  const m = document.querySelector(".brand-mark");
  const h = document.querySelector(".hero-mark");
  return {
    markW: m?.naturalWidth ?? 0,
    heroW: h?.naturalWidth ?? 0,
    navText: document.querySelector(".brand")?.innerText.trim() ?? "",
    markDecorative: m?.getAttribute("alt") === "", // link text names the brand
  };
});
ok(`nav mark renders (${brandOk.markW}px intrinsic)`, brandOk.markW > 0);
ok(`hero mark renders (${brandOk.heroW}px intrinsic)`, brandOk.heroW > 0);
ok("nav mark is marked decorative", brandOk.markDecorative);

// Naming: this site is for the Calcumaker *line*. "16" names one device, so it
// must not appear in brand positions (nav, title, og:title) — only in copy about
// the device. See calcumaker/NAMING.md.
ok(`nav brand is the line, not the device (${JSON.stringify(brandOk.navText)})`,
  /calcumaker/i.test(brandOk.navText) && !/16/.test(brandOk.navText));
ok("<title> names the line, not the device", !/Calcumaker\s*16/i.test(await page.title()));
ok("og:title names the line",
  !/16/.test((await page.locator('meta[property="og:title"]').getAttribute("content")) ?? ""));
ok("brand tagline is present", /every base\.\s*every digit\./i.test(await page.locator(".tagline").innerText()));
ok("the device is still named in the copy",
  (await page.locator("main").innerText()).includes("Calcumaker 16"));
ok("favicon is the brand mark", !!(await page.locator('link[rel="icon"]').getAttribute("href")));
ok("apple-touch-icon present", !!(await page.locator('link[rel="apple-touch-icon"]').getAttribute("href")));

// Links
const href = (sel) => page.locator(sel).first().getAttribute("href");
ok("links to the emulator", (await href('a[href="https://web.calcumaker.co"]')) === "https://web.calcumaker.co");
ok("links to the main repo", !!(await href('a[href*="github.com/calcumaker/calcumaker"]')));
const footText = await page.locator("footer").innerText();
ok("footer carries copyright", footText.includes("© 2026 Yann Ramin"));
ok("footer states the site licence", /MIT/.test(footText) && /BY-SA/.test(footText));
const ext = await page.locator('a[target="_blank"]').all();
const rels = await Promise.all(ext.map((a) => a.getAttribute("rel")));
ok(`all ${ext.length} external links are rel=noopener`, rels.every((r) => (r ?? "").includes("noopener")));

// Images: alt text AND they actually decode (a broken src still has alt text,
// and lazy images below the fold are easy to ship broken).
const imgs = await page.locator("main img").all();
const alts = await Promise.all(imgs.map((i) => i.getAttribute("alt")));
ok(`all ${imgs.length} content images have alt text`, alts.every((a) => (a ?? "").length > 10));
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
const loaded = await page.evaluate(() =>
  [...document.querySelectorAll("main img")].map((i) => {
    const src = i.getAttribute("src");
    // Compare the *attributes* (not i.width/i.height, which are the CSS-rendered
    // size) against the intrinsic aspect — guards against layout shift.
    // Skip SVGs: a viewBox-only SVG has no intrinsic size, so browsers report a
    // default 300x150 and the comparison is meaningless.
    const aw = Number(i.getAttribute("width")), ah = Number(i.getAttribute("height"));
    const raster = !src.endsWith(".svg");
    return {
      src, nw: i.naturalWidth, raster,
      declaredOk: !raster || (aw > 0 && ah > 0 &&
        Math.abs(aw / ah - i.naturalWidth / i.naturalHeight) < 0.005),
    };
  }));
ok(`all images actually load (${loaded.map((l) => l.nw).join(", ")}px)`, loaded.every((l) => l.nw > 0));
ok("raster width/height attrs match intrinsic aspect",
  loaded.filter((l) => l.raster).every((l) => l.declaredOk));
await page.evaluate(() => window.scrollTo(0, 0));

await mkdir(SHOTS, { recursive: true });
await page.screenshot({ path: join(SHOTS, "desktop.png"), fullPage: true });

// Responsive: no horizontal overflow on phones, plus the nav fits its container.
// Note this ran green locally while failing on CI: font metrics differ per
// platform, and the nav was only ~6px over. Trust CI's run, not just this one.
for (const w of [320, 390]) {
  const mp = await browser.newPage({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2 });
  await mp.goto(base, { waitUntil: "networkidle" });
  const m = await mp.evaluate(() => {
    const n = document.querySelector(".nav-inner");
    return {
      sw: document.documentElement.scrollWidth, iw: window.innerWidth,
      navSw: n.scrollWidth, navCw: n.clientWidth,
    };
  });
  ok(`no horizontal overflow at ${w}px (${m.sw} <= ${m.iw})`, m.sw <= m.iw);
  ok(`nav content fits its container at ${w}px (${m.navSw} <= ${m.navCw})`, m.navSw <= m.navCw);
  if (w === 390) await mp.screenshot({ path: join(SHOTS, "mobile.png"), fullPage: true });
  await mp.close();
}

ok(`no page errors (${errors.length})`, errors.length === 0);
if (errors.length) console.log(errors.join("\n"));

await browser.close();
server.close();
console.log(fail === 0 ? "\nSITE VERIFY GREEN" : `\n${fail} FAILURE(S)`);
process.exit(fail === 0 ? 0 : 1);
