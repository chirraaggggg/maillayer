import verification from "../../../../adapter-verification.json";

import { ExternalLink } from "@/components/icon";
import { DocsVersionLink } from "@/components/docs-version-link";
import { useSelectedDocsVersion } from "@/lib/docs-version-state";
import { providers, type Provider } from "@/lib/providers";

type LiveCheckProvider = keyof typeof verification.liveChecks;

export function ProviderGrid() {
  const selectedVersion = useSelectedDocsVersion();

  const visibleProviders = (
    selectedVersion.current
      ? [...providers]
      : providers.filter((provider) => !("currentOnly" in provider && provider.currentOnly))
  ).sort(compareProviders);

  return (
    <div className="not-prose">
      <div className="flex items-center gap-5 py-2 text-xs text-fd-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ExternalLink
            aria-hidden="true"
            className="size-3.5 text-fd-muted-foreground"
            strokeWidth={2.25}
          />
          Live check available
        </span>
      </div>
      <div className="flex flex-col">
        {visibleProviders.map((provider) => (
          <ProviderRow key={provider.key} provider={provider} />
        ))}
      </div>
    </div>
  );
}

export function ProviderBadge({ adapter }: { adapter: string }) {
  const provider = providers.find((item) => item.key === adapter);

  if (!provider) {
    return null;
  }

  return (
    <div className="not-prose my-8 py-1 text-sm text-fd-foreground">
      <div className="flex flex-wrap items-center gap-3">
        <ProviderMark provider={provider} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium">{provider.name}</span>
            <ProviderStatus provider={provider} />
            <code className="break-all text-xs text-fd-muted-foreground">
              {provider.importPath}
            </code>
          </div>
        </div>
        <a
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-fd-border px-3 text-xs font-medium transition hover:bg-fd-accent"
          href={provider.website}
          rel="noreferrer"
          target="_blank"
        >
          Provider docs
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>
      </div>
    </div>
  );
}

function ProviderRow({ provider }: { provider: Provider }) {
  return (
    <article className="-mx-3 grid gap-3 rounded-xl px-3 py-4 transition-colors hover:bg-fd-accent sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <ProviderMark provider={provider} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-fd-foreground">{provider.name}</span>
            <ProviderStatus provider={provider} />
          </div>
          <p className="mt-1 text-sm text-fd-muted-foreground">{provider.summary}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-11 sm:pl-0">
        <DocsVersionLink
          className="inline-flex h-8 items-center justify-center rounded-md border border-fd-border px-3 text-xs font-medium text-fd-foreground transition hover:border-fd-muted-foreground"
          docsPath={provider.docs}
          forceLatest={"currentOnly" in provider && provider.currentOnly}
        >
          Setup
        </DocsVersionLink>
        <a
          aria-label={`Open ${provider.name} website`}
          className="grid size-8 place-items-center rounded-md border border-fd-border text-fd-muted-foreground transition hover:border-fd-muted-foreground hover:text-fd-foreground"
          href={provider.website}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </article>
  );
}

function ProviderStatus({ provider }: { provider: Provider }) {
  const liveCheckAvailable = hasLiveCheck(provider.key);

  if (!liveCheckAvailable) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <a
        href="/docs/adapters/verification"
        aria-label="Live check available — view current evidence"
        className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground"
        title="A configured non-sending probe, not a published passing run"
      >
        <ExternalLink
          aria-hidden="true"
          className="size-3.5 text-fd-muted-foreground"
          strokeWidth={2.25}
        />
        Live check available
      </a>
    </span>
  );
}

function compareProviders(left: Provider, right: Provider) {
  return providerPriority(left) - providerPriority(right);
}

function providerPriority(provider: Provider) {
  if (hasLiveCheck(provider.key)) {
    return 0;
  }

  return 1;
}

function hasLiveCheck(key: string): key is LiveCheckProvider {
  return Object.prototype.hasOwnProperty.call(verification.liveChecks, key);
}

export function ProviderMark({ provider }: { provider: Provider }) {
  if (!provider.logo) {
    return (
      <span className="grid size-8 shrink-0 place-items-center text-[9px] font-semibold text-fd-muted-foreground">
        SMTP
      </span>
    );
  }

  const invertOnDark = "invertOnDark" in provider && provider.invertOnDark;

  return (
    <span className="grid size-8 shrink-0 place-items-center">
      <img
        alt={`${provider.name} logo`}
        className={`size-7 object-contain ${invertOnDark ? "dark:invert" : ""}`}
        height={28}
        src={provider.logo}
        width={28}
      />
    </span>
  );
}
