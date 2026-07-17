"use client";

import { useState } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/editor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/write";
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.message ?? "Something went wrong.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Team password"
        autoFocus
        className="w-full rounded-full border border-hairline bg-card px-5 py-3 text-content outline-none focus:border-saffron"
      />
      {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={busy || !password}
        className="mt-4 w-full rounded-full bg-saffron px-5 py-3 font-semibold text-paper transition-colors hover:bg-saffron-dark disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Open the editor"}
      </button>
    </form>
  );
}
