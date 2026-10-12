import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "assets", "evidence");
const evidenceDir = path.join(process.cwd(), "evidence");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 1100 },
  deviceScaleFactor: 1.5,
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151 Safari/537.36"
});

const page = await context.newPage();
const requests = [];

page.on("request", req => {
  requests.push({
    url: req.url(),
    method: req.method(),
    resourceType: req.resourceType()
  });
});

await page.goto("https://www.klaviyo.com/", {
  waitUntil: "domcontentloaded",
  timeout: 90000
});
await page.waitForTimeout(9000);

await page.screenshot({
  path: path.join(outDir, "klaviyo-homepage.png"),
  fullPage: false
});

const keyPatterns = [
  ["Klaviyo onsite", /klaviyo/i],
  ["Google Tag Manager / Ads", /googletagmanager|googleadservices|doubleclick|google-analytics/i],
  ["Optimizely", /optimizely|zaius/i],
  ["Dun & Bradstreet", /d41\.co|dnb/i],
  ["HubSpot", /hubspot|hs-scripts|hsforms/i],
  ["Capterra", /capterra/i],
  ["Navattic", /navattic/i],
  ["MNTN", /mountain\.com|mntn/i],
  ["Transcend", /transcend|airgap/i]
];

const hits = [];
for (const [vendor, pattern] of keyPatterns) {
  const matched = requests.filter(r => pattern.test(r.url));
  if (matched.length) {
    hits.push({
      vendor,
      count: matched.length,
      sample: matched[0].url,
      resourceType: matched[0].resourceType
    });
  }
}

fs.writeFileSync(
  path.join(evidenceDir, "network-requests.json"),
  JSON.stringify({ capturedAt: new Date().toISOString(), totalRequests: requests.length, hits, requests }, null, 2)
);

function esc(s="") {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

const report = await context.newPage();
await report.setViewportSize({ width: 1600, height: 1100 });

const summaryRows = hits.map(h => `
<tr>
  <td><strong>${esc(h.vendor)}</strong></td>
  <td>${h.count}</td>
  <td>${esc(h.resourceType)}</td>
  <td class="url">${esc(h.sample)}</td>
</tr>`).join("");

const summaryHtml = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; margin:0; background:#f6f7f9; color:#171717; }
  .wrap { width:1460px; margin:48px auto; }
  h1 { font-size:42px; margin:0 0 10px; }
  .sub { color:#555; font-size:20px; margin-bottom:28px; }
  .stats { display:flex; gap:18px; margin-bottom:26px; }
  .card { background:white; border:1px solid #ddd; border-radius:14px; padding:20px 24px; min-width:220px; }
  .num { font-size:34px; font-weight:700; }
  .label { color:#666; font-size:15px; margin-top:5px; }
  table { width:100%; border-collapse:collapse; background:white; border-radius:14px; overflow:hidden; border:1px solid #ddd; }
  th,td { text-align:left; padding:17px 18px; border-bottom:1px solid #e7e7e7; vertical-align:top; font-size:16px; }
  th { background:#111; color:white; font-size:15px; }
  .url { max-width:760px; word-break:break-all; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:13px; }
  .note { margin-top:20px; color:#555; font-size:15px; line-height:1.5; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Klaviyo.com network evidence</h1>
  <div class="sub">Fresh automated browser session · ${new Date().toISOString().slice(0,10)}</div>
  <div class="stats">
    <div class="card"><div class="num">${requests.length}</div><div class="label">total requests observed</div></div>
    <div class="card"><div class="num">${hits.length}</div><div class="label">tracked marketing / data technologies observed</div></div>
  </div>
  <table>
    <thead><tr><th>Technology</th><th>Requests</th><th>Type</th><th>Example request</th></tr></thead>
    <tbody>${summaryRows || '<tr><td colspan="4">No selected vendor patterns observed in this session.</td></tr>'}</tbody>
  </table>
  <div class="note">This capture confirms network activity during the observed session. It does not by itself establish which AI features, models, or optimization settings are enabled inside each platform.</div>
</div>
</body>
</html>`;

await report.setContent(summaryHtml, { waitUntil: "load" });
await report.screenshot({
  path: path.join(outDir, "klaviyo-network-summary.png"),
  fullPage: true
});

const detailHits = hits.flatMap(h => requests.filter(r => keyPatterns.find(([name]) => name === h.vendor)?.[1].test(r.url)).slice(0,3).map(r => ({vendor:h.vendor,...r})));
const detailRows = detailHits.map((r,i) => `
<tr>
  <td>${i+1}</td>
  <td><strong>${esc(r.vendor)}</strong></td>
  <td>${esc(r.resourceType)}</td>
  <td class="url">${esc(r.url)}</td>
</tr>`).join("");

const detailHtml = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; margin:0; background:#0f1115; color:#f4f4f4; }
  .wrap { width:1460px; margin:42px auto; }
  h1 { font-size:38px; margin:0 0 8px; }
  .sub { color:#aeb5c0; font-size:18px; margin-bottom:24px; }
  table { width:100%; border-collapse:collapse; background:#181b21; border:1px solid #303640; border-radius:12px; overflow:hidden; }
  th,td { text-align:left; padding:14px 16px; border-bottom:1px solid #303640; vertical-align:top; font-size:15px; }
  th { background:#222731; color:#fff; }
  .url { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px; word-break:break-all; color:#d5dde8; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Selected Klaviyo.com tracking requests</h1>
  <div class="sub">Sample requests captured from the same browser session</div>
  <table>
    <thead><tr><th>#</th><th>Technology</th><th>Resource type</th><th>Request URL</th></tr></thead>
    <tbody>${detailRows || '<tr><td colspan="4">No selected requests observed.</td></tr>'}</tbody>
  </table>
</div>
</body>
</html>`;

await report.setContent(detailHtml, { waitUntil: "load" });
await report.screenshot({
  path: path.join(outDir, "klaviyo-network-detail.png"),
  fullPage: true
});

await browser.close();
console.log(JSON.stringify({ totalRequests: requests.length, hits }, null, 2));
