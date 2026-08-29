import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the WORLDWISE application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>WORLDWISE — 世界時計<\/title>/i);
  assert.match(html, /<link[^>]+href=["']\/favicon\.svg["'][^>]*>/i);
  assert.match(html, /WORLDWISE/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
});

test("keeps the updated headline and favicon in the product source", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /世界の「今」を、/);
  assert.doesNotMatch(page, /世界の「いま」を、/);
  assert.match(page, /setInterval\(\(\)=>setNow\(new Date\(\)\),1000\)/);
  assert.match(layout, /WORLDWISE — 世界時計/);
  assert.match(layout, /\/favicon\.svg/);
  await access(new URL("../public/favicon.svg", import.meta.url));
});
