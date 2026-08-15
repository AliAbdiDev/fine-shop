import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

for (const file of [".env.development.local", ".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const SOURCE = process.argv[2] ?? process.env.SCHEMA_URL;

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");

const OUT = path.resolve(
  process.env.SCHEMA_OUT ?? "src/core/mocks/schema.json",
);

console.log(`→ source: ${SOURCE}\n→ base  : ${BASE_URL}`);

const raw = /^https?:/.test(SOURCE)
  ? await fetch(SOURCE, {
      headers: { Accept: "application/yaml, application/json" },
    }).then((r) => {
      if (!r.ok) throw new Error(`${SOURCE} → ${r.status} ${r.statusText}`);
      return r.text();
    })
  : await fs.readFile(SOURCE, "utf8");

const doc = YAML.parse(raw);
if (!doc?.paths) throw new Error("Invalid OpenAPI document: `paths` missing");

doc.servers = [{ url: BASE_URL }];

for (const [p, v] of Object.entries(doc.paths)) {
  const alt = p.endsWith("/") ? p.slice(0, -1) : `${p}/`;
  if (alt && alt !== "/" && !doc.paths[alt]) doc.paths[alt] = v;
}

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(doc, null, 2), "utf8");

console.log(
  `✔ ${Object.keys(doc.paths).length} paths → ${path.relative(process.cwd(), OUT)}`,
);
