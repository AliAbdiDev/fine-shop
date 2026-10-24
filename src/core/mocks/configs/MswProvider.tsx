"use client";
import { useEffect, useState } from "react";

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(
    process.env.NEXT_PUBLIC_API_MOCKING !== "true",
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === "true" && !ready) {
      import("./browser").then(async ({ startMocking }) => {
        await startMocking();
        setReady(true);
      });
    }
  }, [ready]);

  if (!ready) return null;
  return <>{children}</>;
}
