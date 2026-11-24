import type { ReactNode } from "react";

export function Alert({ tone = "info", children }: { tone?: "info" | "warn" | "error"; children: ReactNode }) {
  return <div className={`alert alert-${tone}`}>{children}</div>;
}
