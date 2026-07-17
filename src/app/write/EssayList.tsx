"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { EssayListItem } from "@/lib/editorApi";
import { api, ApiError } from "@/components/editor/editorUtils";

const STATUS_LABEL: Record<EssayListItem["status"], string> = {
  draft: "Draft",
  published: "Published",
  "published+draft": "Published · edited",
};

export function EssayList() {
  const [essays, setEssays] = useState<EssayListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api<{ essays: EssayListItem[] }>("/api/editor/essays")
      .then((res) => setEssays(res.essays))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          window.location.href = "/write/login";
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load.");
      });
  }, []);

  async function newEssay() {
    setCreating(true);
    try {
      const { id } = await api<{ id: string }>("/api/editor/essays", {
        method: "POST",
        body: JSON.stringify({}),
      });
      window.location.href = `/write/${encodeURIComponent(id)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create an essay.");
      setCreating(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={newEssay}
        disabled={creating}
        className="rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-saffron-dark disabled:opacity-50"
      >
        {creating ? "Creating…" : "＋ New essay"}
      </button>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {essays === null && !error && (
        <p className="mt-8 font-mono text-sm text-content-soft/70">Loading essays…</p>
      )}

      {essays && essays.length === 0 && (
        <p className="mt-8 text-content-soft">
          Nothing here yet — start your first story.
        </p>
      )}

      <ul className="mt-6 divide-y divide-hairline">
        {essays?.map((essay) => (
          <li key={essay.id}>
            <Link
              href={`/write/${encodeURIComponent(essay.id)}`}
              className="group flex items-baseline gap-4 py-5"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-essay text-xl font-semibold text-content transition-colors group-hover:text-saffron">
                  {essay.title}
                </span>
                <span className="mt-1 block text-sm text-content-soft/80">
                  {[essay.location, essay.authorName].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${
                  essay.status === "draft"
                    ? "border-hairline text-content-soft/70"
                    : essay.status === "published"
                      ? "border-saffron/30 text-saffron"
                      : "border-marigold/40 text-marigold"
                }`}
              >
                {STATUS_LABEL[essay.status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
