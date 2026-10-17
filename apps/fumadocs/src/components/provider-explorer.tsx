import { useMemo, useState } from "react";
import { ExternalLink, Check, X } from "./icon";
import { providerExplorerEntries, type ProviderExplorerEntry } from "@/lib/provider-explorer";

export type ExplorerFilter = {
  search: string;
  attachments: boolean;
  headers: boolean;
  tags: boolean;
  metadata: boolean;
  scheduling: boolean;
  personalized: boolean | "any";
};

const defaultFilter: ExplorerFilter = {
  search: "",
  attachments: false,
  headers: false,
  tags: false,
  metadata: false,
  scheduling: false,
  personalized: false,
};

export function ProviderExplorer() {
  const [filters, setFilters] = useState<ExplorerFilter>(defaultFilter);
  const [showComparison, setShowComparison] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return providerExplorerEntries.filter((entry) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();

        if (
          !entry.name.toLowerCase().includes(q) &&
          !entry.id.toLowerCase().includes(q) &&
          !entry.summary.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (filters.attachments && !entry.fieldSupport.attachments) return false;

      if (filters.headers && !entry.fieldSupport.headers) return false;

      if (filters.tags && !entry.fieldSupport.tags) return false;

      if (filters.metadata && !entry.fieldSupport.metadata) return false;

      if (filters.scheduling && !entry.capabilities.scheduling) return false;

      if (filters.personalized && entry.capabilities.personalized !== "native") {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="rounded-lg border border-fd-border bg-fd-secondary/20 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search providers by name..."
              className="w-full rounded-md border border-fd-border bg-fd-background px-3 py-2 text-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison((s) => !s)}
              className="inline-flex h-9 items-center rounded-md border border-fd-border px-3 text-sm font-medium transition hover:bg-fd-accent"
            >
              {showComparison ? "Hide comparison" : "Compare"}
            </button>
            <button
              onClick={() => setFilters(defaultFilter)}
              className="inline-flex h-9 items-center rounded-md border border-fd-border px-3 text-sm font-medium transition hover:bg-fd-accent"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <FilterToggle
            label="Attachments"
            checked={filters.attachments}
            onChange={(v) => setFilters((f) => ({ ...f, attachments: v }))}
          />
          <FilterToggle
            label="Headers"
            checked={filters.headers}
            onChange={(v) => setFilters((f) => ({ ...f, headers: v }))}
          />
          <FilterToggle
            label="Tags"
            checked={filters.tags}
            onChange={(v) => setFilters((f) => ({ ...f, tags: v }))}
          />
          <FilterToggle
            label="Metadata"
            checked={filters.metadata}
            onChange={(v) => setFilters((f) => ({ ...f, metadata: v }))}
          />
          <FilterToggle
            label="Scheduling"
            checked={filters.scheduling}
            onChange={(v) => setFilters((f) => ({ ...f, scheduling: v }))}
          />
          <FilterToggle
            label="Native personalization"
            checked={!!filters.personalized}
            onChange={(v) => setFilters((f) => ({ ...f, personalized: v }))}
          />
        </div>

        <p className="text-xs text-fd-muted-foreground">
          Filters only show verified capabilities from the implementation. Unsupported/unverified
          capabilities are not implied.
        </p>
      </div>

      {/* Provider Grid / Workspace Composition */}
      <div className="provider-grid">
        {filtered.map((entry) => (
          <ProviderCard
            key={entry.id}
            entry={entry}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>

      {showComparison && (
        <ComparisonView selected={selected} setSelected={setSelected} entries={filtered} />
      )}

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-fd-muted-foreground">
          No providers match your filters. Try adjusting your criteria.
        </p>
      )}
    </div>
  );
}

function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-fd-border px-2 py-1 transition hover:bg-fd-accent has-[:checked]:bg-fd-accent">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5"
      />
      <span>{label}</span>
    </label>
  );
}

function ProviderCard({
  entry,
  selected,
  setSelected,
}: {
  entry: ProviderExplorerEntry;
  selected: string[];
  setSelected: (s: string[]) => void;
}) {
  const isSelected = selected.includes(entry.id);

  return (
    <article className="provider-card bg-white rounded-border border-border border-y border-border py-6 sm:py-8 transition-colors hover:border-primary hover:bg-fd-primary/5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3 sm:items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            if (e.target.checked) {
              setSelected([...selected, entry.id]);
            } else {
              setSelected(selected.filter((id) => id !== entry.id));
            }
          }}
          className="mt-1 size-4 sm:mt-0"
          aria-label={`Select ${entry.name} for comparison`}
        />

        <div className="flex-1 min-w-0 space-y-3 sm:space-y-0 sm:pl-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-font font-medium text-foreground">
              {entry.name}
            </h3>
            <code className="text-xs text-fd-muted-foreground">
              {entry.importPath}
            </code>
          </div>

          <p className="text-sm text-fd-muted-foreground line-clamp-2">
            {entry.summary}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {entry.capabilities.scheduling && (
              <span className="rounded-sm bg-fd-primary/10 px-2 py-0.5 text-fd-primary">
                Scheduling
              </span>
            )}
            {entry.capabilities.repeatedHeaders && (
              <span className="rounded-sm bg-fd-primary/10 px-2 py-0.5 text-fd-primary">
                Repeated headers
              </span>
            )}
            {entry.capabilities.idempotency === "native" && (
              <span className="rounded-sm bg-fd-primary/10 px-2 py-0.5 text-fd-primary">
                Native idempotency
              </span>
            )}
            {entry.capabilities.personalized === "native" && (
              <span className="rounded-sm bg-fd-primary/10 px-2 py-0.5 text-fd-primary">
                Native personalization
              </span>
            )}
          </div>

          {entry.limitations.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-fd-muted-foreground">
                Limitations
              </p>
              <ul className="list-disc pl-4 text-xs text-fd-muted-foreground">
                {entry.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-6 sm:pl-0">
          <a
            href={entry.docsPath}
            className="inline-flex h-8 items-center justify-center rounded-md border border-fd-border px-3 text-xs font-medium transition hover:bg-fd-accent"
          >
            Setup
          </a>
          {entry.officialDocs && (
            <a
              href={entry.officialDocs}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${entry.name} official docs`}
              className="grid size-8 place-items-center rounded-md border border-fd-border text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-foreground"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ComparisonView({
  selected,
  entries,
}: {
  selected: string[];
  setSelected: (s: string[]) => void;
  entries: ProviderExplorerEntry[];
}) {
  const selectedEntries = entries.filter((e) => selected.includes(e.id));

  const fields: Array<{ key: keyof ProviderExplorerEntry["fieldSupport"]; label: string }> = [
    { key: "cc", label: "CC" },
    { key: "bcc", label: "BCC" },
    { key: "replyTo", label: "Reply-To" },
    { key: "headers", label: "Headers" },
    { key: "attachments", label: "Attachments" },
    { key: "tags", label: "Tags" },
    { key: "metadata", label: "Metadata" },
    { key: "sendAt", label: "Scheduling (sendAt)" },
  ];

  if (selectedEntries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-fd-border p-4 text-center text-sm text-fd-muted-foreground">
        Select providers to compare using the checkboxes
      </div>
    );
  }

  return (
    <div className="comparison-view overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border bg-fd-secondary/30">
            <th className="sticky left-0 bg-fd-secondary/30 p-2 text-left font-medium">
              Feature
            </th>
            {selectedEntries.map((e) => (
              <th key={e.id} className="p-2 text-left font-medium">
                {e.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.key} className="border-b border-fd-border/50">
              <td className="sticky left-0 bg-fd-background p-2 font-medium">
                {f.label}
              </td>
              {selectedEntries.map((e) => (
                <td key={e.id} className="p-2">
                  {e.fieldSupport[f.key] ? (
                    <Check className="size-4 text-fd-primary" />
                  ) : (
                    <X className="size-4 text-fd-muted-foreground" />
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="sticky left-0 bg-fd-background p-2 font-medium">
              Idempotency
            </td>
            {selectedEntries.map((e) => (
              <td key={e.id} className="p-2 text-xs text-fd-muted-foreground">
                {e.capabilities.idempotency}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}