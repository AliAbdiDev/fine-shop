"use client";

import { useState } from "react";

import { api } from "@/core/services/configs/api";
import { type AppError } from "@/core/technical-domains/status";

const CASES = ["401", "403", "404", "422", "429", "500", "network"] as const;

// Only for dev
export function ErrorTester() {
  const [result, setResult] = useState<AppError | null>(null);

  async function run(name: (typeof CASES)[number]) {
    // network: hit an unroutable port so no response ever comes back → status 0.
    const res =
      name === "network"
        ? await api.get("http://127.0.0.1:1/__unreachable")
        : await api.get(`/__test/${name}/`);

    // On purpose: show the normalized error, don't trigger real side effects
    // (calling useReportError here would actually log you out on 401).
    setResult(res.ok ? null : res.error);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {CASES.map((c) => (
          <button key={c} type="button" onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>

      {result && (
        <pre className="bg-muted overflow-auto rounded p-3 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
