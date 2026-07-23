"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import FilterRail from "@/components/FilterRail";
import ProgramCard from "@/components/ProgramCard";
import { formatMoney } from "@/lib/currency";
import {
  emptyFilters,
  activeFilterCount,
  filtersToQueryString,
  type SearchFacets,
  type FilterState,
  type SearchResultProgram,
} from "@/lib/search";

type Suggestion = { slug: string; name: string; university_slug: string; university_name: string; country_slug: string };

const MAX_COMPARE = 3;

function SkeletonCard() {
  return (
    <div className="h-full animate-pulse overflow-hidden rounded-3xl border border-line bg-white">
      <div className="h-32 bg-surface" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-2/3 rounded bg-surface" />
        <div className="h-3 w-full rounded bg-surface" />
        <div className="h-3 w-1/2 rounded bg-surface" />
      </div>
    </div>
  );
}

export default function SearchHub({
  initialResults,
  initialTotal = 0,
}: {
  /** Server-rendered, unfiltered page-1 results — keeps real program cards in
   *  the static HTML instead of an empty skeleton until the client fetch
   *  resolves. See src/lib/data/searchIndex.ts. */
  initialResults?: SearchResultProgram[];
  initialTotal?: number;
}) {
  const router = useRouter();
  const [facets, setFacets] = useState<SearchFacets | null>(null);
  const [filters, setFilters] = useState<FilterState>(emptyFilters());
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResultProgram[] | null>(initialResults ?? null);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(!initialResults);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The mount-time effect run below would otherwise immediately re-fetch the
  // exact same unfiltered page-1 data we already have server-rendered.
  const skipNextFetch = useRef(!!initialResults);

  useEffect(() => {
    fetch("/api/programs/facets")
      .then((r) => r.json())
      .then(setFacets)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      setLoading(true);
      fetch(`/api/programs/search?${filtersToQueryString(filters, page)}`)
        .then((r) => r.json())
        .then((data: { results: SearchResultProgram[]; total: number }) => {
          setResults(data.results);
          setTotal(data.total);
        })
        .catch(() => {
          setResults([]);
          setTotal(0);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      if (fetchTimer.current) clearTimeout(fetchTimer.current);
    };
  }, [filters, page]);

  function onSearchInputChange(v: string) {
    setSearchInput(v);
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    if (v.trim().length < 2) {
      setSuggestions([]);
      setSuggestOpen(false);
      return;
    }
    suggestTimer.current = setTimeout(() => {
      fetch(`/api/search/suggest?q=${encodeURIComponent(v)}`)
        .then((r) => r.json())
        .then((data: { suggestions: Suggestion[] }) => {
          setSuggestions(data.suggestions);
          setSuggestOpen(data.suggestions.length > 0);
        })
        .catch(() => {});
    }, 250);
  }

  function commitSearch() {
    setSuggestOpen(false);
    setPage(1);
    setFilters((f) => ({ ...f, q: searchInput }));
  }

  function goToSuggestion(s: Suggestion) {
    setSuggestOpen(false);
    router.push(`/destinations/${s.country_slug}/universities/${s.university_slug}/programs/${s.slug}/`);
  }

  function updateFilters(next: FilterState) {
    setPage(1);
    setFilters(next);
  }

  function clearAll() {
    setSearchInput("");
    setPage(1);
    setFilters(emptyFilters());
  }

  function toggleCompare(slug: string) {
    setCompareSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < MAX_COMPARE ? [...prev, slug] : prev
    );
  }

  const compared = (results ?? []).filter((p) => compareSlugs.includes(p.slug));
  const totalPages = Math.max(1, Math.ceil(total / 12));
  const activeCount = activeFilterCount(filters);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 pb-28 lg:px-8">
      <div className="relative mx-auto max-w-2xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-mute" />
          <input
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitSearch()}
            onFocus={() => suggestions.length > 0 && setSuggestOpen(true)}
            onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
            placeholder="Search by program, subject, or university…"
            className="w-full rounded-full border border-line bg-white py-3.5 pl-12 pr-28 text-sm font-medium outline-none focus:border-study focus:ring-4 focus:ring-study-soft"
          />
          <button
            type="button"
            onClick={commitSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-study px-5 py-2 text-sm font-bold text-white"
          >
            Search
          </button>
        </div>
        {suggestOpen && (
          <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
            {suggestions.map((s) => (
              <button
                key={s.slug}
                type="button"
                onMouseDown={() => goToSuggestion(s)}
                className="flex w-full flex-col items-start px-5 py-3 text-left hover:bg-surface"
              >
                <span className="text-sm font-bold">{s.name}</span>
                <span className="text-xs text-ink-soft">{s.university_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between lg:hidden">
        <p className="text-sm text-ink-soft">{loading ? "Searching…" : `${total} program${total === 1 ? "" : "s"}`}</p>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-bold"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[18rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-line bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-bold">Filters</h3>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="text-xs font-bold text-study hover:underline">
                  Clear all
                </button>
              )}
            </div>
            {facets ? <FilterRail facets={facets} value={filters} onChange={updateFilters} /> : <p className="text-xs text-ink-soft">Loading filters…</p>}
          </div>
        </aside>

        <div>
          <p className="mb-5 hidden text-sm text-ink-soft lg:block">
            {loading ? "Searching…" : `${total} program${total === 1 ? "" : "s"} match your filters`}
          </p>

          {loading && !results ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results && results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
              <p className="font-display text-lg font-bold">No programs match these filters</p>
              <p className="mt-2 text-sm text-ink-soft">Try widening your search or clearing a few filters.</p>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="mt-4 rounded-full bg-study px-5 py-2.5 text-sm font-bold text-white">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results?.map((p, i) => (
                <ProgramCard
                  key={p.slug}
                  program={p}
                  countrySlug={p.countrySlug}
                  universitySlug={p.universitySlug}
                  accent={p.countryAccent}
                  delay={i * 40}
                  compare={{
                    checked: compareSlugs.includes(p.slug),
                    disabled: !compareSlugs.includes(p.slug) && compareSlugs.length >= MAX_COMPARE,
                    onToggle: () => toggleCompare(p.slug),
                  }}
                />
              ))}
            </div>
          )}

          {results && results.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-line px-4 py-2 text-sm font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-ink-soft">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-line px-4 py-2 text-sm font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Filters</h3>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="rounded-full bg-surface p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            {facets && <FilterRail facets={facets} value={filters} onChange={updateFilters} />}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-full bg-study px-5 py-3 text-sm font-bold text-white"
            >
              Show {total} result{total === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}

      {compared.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">
                Comparing {compared.length} program{compared.length > 1 ? "s" : ""}
                {compared.length === 1 && " — select another to compare"}
              </p>
              <button
                type="button"
                onClick={() => setCompareSlugs([])}
                className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-ink"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
            {compared.length > 1 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wider text-ink-mute">
                      <th className="py-2 pr-4">Program</th>
                      <th className="py-2 pr-4">University</th>
                      <th className="py-2 pr-4">Country</th>
                      <th className="py-2 pr-4">Tuition/yr</th>
                      <th className="py-2 pr-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compared.map((p) => (
                      <tr key={p.slug} className="border-t border-line">
                        <td className="py-2 pr-4 font-bold">{p.name}</td>
                        <td className="py-2 pr-4">{p.universityName}</td>
                        <td className="py-2 pr-4">{p.countryName}</td>
                        <td className="py-2 pr-4">
                          {p.tuitionPerYear ? formatMoney(p.tuitionPerYear, p.currency) : "On request"}
                        </td>
                        <td className="py-2 pr-4">{p.durationMonths ? `${p.durationMonths} months` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
