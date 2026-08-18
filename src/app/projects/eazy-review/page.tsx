import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Github,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REPOSITORY_URL = "https://github.com/Tyson-Hu/Eazy-Review";
const EVIDENCE_COMMIT = "72149320c328532d2fb2e01da944bfa4b3cc9244";
const EVIDENCE_BASE = `${REPOSITORY_URL}/blob/${EVIDENCE_COMMIT}`;
const EAZY_REVIEW_ICON =
  "https://assets.tianzhe.me/projects/eazy-review/icon.svg";

const evidenceUrl = (path: string, lines?: string) =>
  `${EVIDENCE_BASE}/${path}${lines ? `#${lines}` : ""}`;

const EVIDENCE = {
  commit: `${REPOSITORY_URL}/commit/${EVIDENCE_COMMIT}`,
  dataModel: evidenceUrl("docs/DATA_MODEL.md"),
  apiContracts: evidenceUrl("docs/API_CONTRACTS.md"),
  tasks: evidenceUrl("docs/TASKS.md"),
  rlsMigration: evidenceUrl(
    "supabase/migrations/20260729214448_task_12_least_privilege_rls_grants.sql",
    "L140-L271"
  ),
  currentRatingGrants: evidenceUrl(
    "supabase/migrations/20260809151511_task_17_sneaker10_rating_rubric.sql",
    "L580-L619"
  ),
  authorizationTests: evidenceUrl(
    "supabase/tests/database/authorization.test.sql",
    "L474-L754"
  ),
  ratingSave: evidenceUrl("src/features/ratings/api.ts", "L192-L447"),
  scoreDerivation: evidenceUrl(
    "supabase/migrations/20260809151511_task_17_sneaker10_rating_rubric.sql",
    "L178-L578"
  ),
  ratingMutation: evidenceUrl(
    "src/features/ratings/mutations.ts",
    "L23-L100"
  ),
  ratingMutationTests: evidenceUrl(
    "src/features/ratings/mutations.test.tsx",
    "L173-L237"
  ),
  formPreservationTest: evidenceUrl(
    "src/features/ratings/RateAndDetail.test.tsx",
    "L378-L416"
  ),
  aggregateTests: evidenceUrl(
    "supabase/tests/database/aggregates.test.sql",
    "L108-L187"
  ),
  concurrencyHarness: evidenceUrl(
    "scripts/test-db-concurrency.cjs",
    "L328-L497"
  ),
  authProvider: evidenceUrl("src/features/auth/AuthProvider.tsx", "L438-L758"),
  task15Evidence: evidenceUrl(
    "docs/evidence/task-15-public-catalog/RESULT.md",
    "L182-L252"
  ),
  task16Evidence: evidenceUrl(
    "docs/evidence/task-16-auth-account/RESULT.md",
    "L70-L102"
  ),
  task17Evidence: evidenceUrl(
    "docs/evidence/task-17-my-rating-persistence/RESULT.md",
    "L114-L180"
  ),
  task18Evidence: evidenceUrl(
    "docs/evidence/task-18-password-recovery/RESULT.md",
    "L212-L302"
  ),
  databaseAcceptance: evidenceUrl(
    "docs/evidence/task-11-12-database-acceptance/RESULT.md"
  ),
  expoCi: evidenceUrl(".github/workflows/expo-ci.yml"),
  databaseCi: evidenceUrl(".github/workflows/database-ci.yml"),
} as const;

const STACK = [
  "React Native",
  "Expo",
  "TypeScript",
  "TanStack Query",
  "Supabase",
  "PostgreSQL",
] as const;

const DECISIONS = [
  {
    number: "01",
    title: "Keep ownership at the data boundary",
    problem:
      "A screen-level check cannot stop a caller from addressing another user's rating through the Data API.",
    decision:
      "I kept user_ratings owner-scoped with explicit column grants plus PostgreSQL RLS. auth.uid() must match user_id, writes require a published product, raw ratings and private notes are not public, and clients receive no aggregate-write policy.",
    why:
      "The ownership invariant travels with the data instead of depending on one navigation path or client implementation.",
    verification:
      "Transaction-rolled-back authorization scenarios exercise anonymous, owner, cross-user, unpublished-product, privilege, and helper-execution behavior.",
    boundary:
      "This is least-privilege enforcement for the current schema, not a claim about production operations or traffic.",
    links: [
      { label: "RLS and grant migration", href: EVIDENCE.rlsMigration },
      { label: "Current column allowlist", href: EVIDENCE.currentRatingGrants },
      { label: "Authorization tests", href: EVIDENCE.authorizationTests },
    ],
  },
  {
    number: "02",
    title: "Keep aggregate score truth server-owned",
    problem:
      "Client-written composites or Community Scores can disagree with the submitted dimensions and diverge under concurrent database writers.",
    decision:
      "The client writes ten rating dimensions and an optional private note only. PostgreSQL derives the My Rating composite and trigger-owned Community aggregates. The create/edit path reads first, updates or inserts, recovers a 23505 branch with a permitted update, then invalidates public and owner-scoped caches.",
    why:
      "One derivation boundary keeps personal and aggregate score responsibilities explicit and makes connected reads return database truth.",
    verification:
      "The write branches and invalidations have focused frontend tests; pgTAP covers aggregate refresh; the database harness exercises two different writers on one product and overlapping multi-product deletes.",
    boundary:
      "The 23505 recovery branch is unit-tested, while the database race harness covers aggregate writer/delete races rather than a same-user PostgREST first-save race. No optimistic aggregate is shown.",
    links: [
      { label: "Rating write path", href: EVIDENCE.ratingSave },
      { label: "Score derivation migration", href: EVIDENCE.scoreDerivation },
      { label: "Aggregate tests", href: EVIDENCE.aggregateTests },
      { label: "Concurrency harness", href: EVIDENCE.concurrencyHarness },
    ],
  },
  {
    number: "03",
    title: "Model failure as product behavior",
    problem:
      "Mobile requests can start offline, time out, lose the backend mid-flight, or receive stale authentication and recovery events.",
    decision:
      "Known-offline rating saves fail fast, connected requests have a deadline, and the save mutation neither pauses indefinitely nor retries automatically. Failed saves keep the draft for manual retry. Password recovery uses direct Supabase Auth calls plus a verified-only phase and generation/principal guards for stale events.",
    why:
      "A failed operation settles into understandable, recoverable UI without being reported as persisted or forcing the user to re-enter a rating.",
    verification:
      "Focused current-code mutation, form-state, AuthProvider, and recovery tests are paired with dated, accepted physical-device offline/reconnect and password-recovery evidence.",
    boundary:
      "Catalog cache is memory-only. There is no durable offline write queue, and production recovery-host configuration remains release work.",
    links: [
      { label: "Mutation behavior", href: EVIDENCE.ratingMutation },
      { label: "Failure-state tests", href: EVIDENCE.ratingMutationTests },
      { label: "Recovery state machine", href: EVIDENCE.authProvider },
      { label: "Task 18 device evidence", href: EVIDENCE.task18Evidence },
    ],
  },
] as const;

const VERIFICATION_ROWS = [
  {
    claim: "Anonymous connected catalog and reconnect behavior",
    evidence: [
      { label: "Task 15 result", href: EVIDENCE.task15Evidence },
      { label: "API contract", href: EVIDENCE.apiContracts },
    ],
  },
  {
    claim: "Email/password identity, session restore, and cache isolation",
    evidence: [
      { label: "Task 16 result", href: EVIDENCE.task16Evidence },
      { label: "AuthProvider", href: EVIDENCE.authProvider },
    ],
  },
  {
    claim: "Durable create/edit ratings and explicit save failures",
    evidence: [
      { label: "Task 17 result", href: EVIDENCE.task17Evidence },
      { label: "Draft-preservation test", href: EVIDENCE.formPreservationTest },
    ],
  },
  {
    claim: "Owner-only RLS and least-privilege grants",
    evidence: [
      { label: "Database acceptance", href: EVIDENCE.databaseAcceptance },
      { label: "Policy tests", href: EVIDENCE.authorizationTests },
    ],
  },
  {
    claim: "Server-derived aggregates and database race behavior",
    evidence: [
      { label: "Aggregate pgTAP", href: EVIDENCE.aggregateTests },
      { label: "Concurrency harness", href: EVIDENCE.concurrencyHarness },
    ],
  },
  {
    claim: "Verified-only password recovery and stale-event guards",
    evidence: [
      { label: "Task 18 result", href: EVIDENCE.task18Evidence },
      { label: "Recovery state machine", href: EVIDENCE.authProvider },
    ],
  },
  {
    claim: "Frontend, repository, database, security, and concurrency gates",
    evidence: [
      { label: "Expo CI", href: EVIDENCE.expoCi },
      { label: "Database CI", href: EVIDENCE.databaseCi },
    ],
  },
] as const;

const pageTitle = "Eazy Review Engineering Proof";
const pageDescription =
  "A five-minute, evidence-backed case study of Eazy Review's mobile architecture, PostgreSQL authorization, server-owned aggregate scores, and connected failure handling.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/projects/eazy-review" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/projects/eazy-review",
    type: "article",
    images: [{ url: EAZY_REVIEW_ICON, alt: "Eazy Review app icon" }],
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
    card: "summary",
    images: [EAZY_REVIEW_ICON],
  },
};

function EvidenceLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-9 items-center gap-1 rounded-md font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {description}
      </p>
    </div>
  );
}

export default function EazyReviewProofPage() {
  return (
    <main className="flex min-h-dvh flex-col gap-20 pb-8">
      <header className="space-y-8">
        <Link
          href="/"
          className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Portfolio
        </Link>

        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            Independent engineering project
          </Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tighter sm:text-5xl">
              Eazy Review
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              A mobile product-review application with an anonymous connected
              catalog, email/password accounts, durable per-user ratings, Rated
              Products, and password recovery on Supabase and PostgreSQL.
            </p>
          </div>

          <ul aria-label="Core technology stack" className="flex flex-wrap gap-2">
            {STACK.map((technology) => (
              <li key={technology}>
                <Badge variant="outline" className="h-7 font-medium">
                  {technology}
                </Badge>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="h-4 w-4" aria-hidden />
                GitHub repository
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#verification" className="gap-2">
                How I verified it
                <ArrowDown className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
        </div>

        <ul
          aria-label="Engineering proof highlights"
          className="grid gap-3 sm:grid-cols-3"
        >
          <li className="rounded-xl border bg-card p-4">
            <ShieldCheck className="mb-3 h-5 w-5" aria-hidden />
            <p className="text-sm font-semibold">Data-bound authorization</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Owner-scoped PostgreSQL RLS protects personal ratings and private
              notes at the database boundary.
            </p>
          </li>
          <li className="rounded-xl border bg-card p-4">
            <RefreshCcw className="mb-3 h-5 w-5" aria-hidden />
            <p className="text-sm font-semibold">Honest connected failures</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Offline, timeout, and unreachable-backend paths settle explicitly;
              failed saves keep the draft for retry.
            </p>
          </li>
          <li className="rounded-xl border bg-card p-4">
            <CheckCircle2 className="mb-3 h-5 w-5" aria-hidden />
            <p className="text-sm font-semibold">Inspectable verification</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Frontend, authorization, aggregate, and database race checks are
              paired with dated, accepted device evidence.
            </p>
          </li>
        </ul>

        <p className="text-xs leading-5 text-muted-foreground">
          Evidence audited against commit{" "}
          <EvidenceLink href={EVIDENCE.commit}>7214932</EvidenceLink>.
        </p>
      </header>

      <section aria-labelledby="architecture-title" className="space-y-8">
        <SectionHeading
          id="architecture-title"
          eyebrow="Architecture"
          title="Clear ownership at each boundary"
          description="Expo Router owns navigation and screen behavior. TanStack Query manages connected catalog and rating query state where applicable; Supabase Auth operations call the Auth SDK directly. PostgreSQL owns catalog, personal rating, and aggregate state behind RLS and trigger functions."
        />

        <div
          aria-label="Eazy Review architecture responsibility flow"
          className="space-y-3"
        >
          <div className="rounded-xl border bg-card p-5">
            <p className="font-mono text-xs text-muted-foreground">01 · Client</p>
            <p className="mt-2 font-semibold">React Native + Expo Router</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Navigation, rendering, form state, and client-side validation.
            </p>
          </div>
          <ArrowDown
            className="mx-auto h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <div className="rounded-xl border bg-card p-5">
            <p className="font-mono text-xs text-muted-foreground">
              02 · Connected state
            </p>
            <p className="mt-2 font-semibold">TanStack Query + NetInfo</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Query lifecycle, public versus owner-scoped cache keys,
              reconnect/refetch behavior, and post-write invalidation. Auth is
              not routed through this layer.
            </p>
          </div>
          <ArrowDown
            className="mx-auto h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <div className="rounded-xl border bg-card p-5">
            <p className="font-mono text-xs text-muted-foreground">
              03 · Shared service client
            </p>
            <p className="mt-2 font-semibold">Supabase JavaScript client</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              One typed client issues PostgreSQL Data API requests and direct
              Supabase Auth calls.
            </p>
          </div>
          <ArrowDown
            className="mx-auto h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <p className="font-mono text-xs text-muted-foreground">
                04A · Identity
              </p>
              <p className="mt-2 font-semibold">Supabase Auth</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Email/password identity, local session lifecycle, and verified
                password-recovery state.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <p className="font-mono text-xs text-muted-foreground">
                04B · Data boundary
              </p>
              <p className="mt-2 flex items-center gap-2 font-semibold">
                <Database className="h-4 w-4" aria-hidden />
                PostgreSQL
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Published catalog, owner ratings, and trigger-derived aggregates.
                Explicit grants and RLS gate access at the row and column boundary.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Inspect the{" "}
          <EvidenceLink href={EVIDENCE.apiContracts}>client contracts</EvidenceLink>{" "}
          and{" "}
          <EvidenceLink href={EVIDENCE.dataModel}>data boundary</EvidenceLink>.
        </p>
      </section>

      <section aria-labelledby="decisions-title" className="space-y-8">
        <SectionHeading
          id="decisions-title"
          eyebrow="Three engineering decisions"
          title="The choices that carry the most risk"
          description="Each decision connects a product or security problem to an implementation boundary, automated proof, and an explicit limit."
        />

        <div className="space-y-5">
          {DECISIONS.map((decision) => (
            <article key={decision.number} className="rounded-xl border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="font-mono text-sm text-muted-foreground">
                  {decision.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {decision.title}
                  </h3>
                  <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                    <p>
                      <strong className="font-semibold text-foreground">Problem — </strong>
                      {decision.problem}
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Decision — </strong>
                      {decision.decision}
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Why — </strong>
                      {decision.why}
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Verification — </strong>
                      {decision.verification}
                    </p>
                    <p>
                      <strong className="font-semibold text-foreground">Boundary — </strong>
                      {decision.boundary}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {decision.links.map((link) => (
                      <EvidenceLink key={link.href} href={link.href}>
                        {link.label}
                      </EvidenceLink>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="verification"
        aria-labelledby="verification-title"
        className="scroll-mt-8 space-y-8"
      >
        <SectionHeading
          id="verification-title"
          eyebrow="Verification"
          title="How I verified it"
          description="The proof is intentionally layered: current implementation and focused tests, database behavior, dated accepted device evidence, and CI definitions."
        />

        <ul className="overflow-hidden rounded-xl border bg-card">
          {VERIFICATION_ROWS.map((row, index) => (
            <li
              key={row.claim}
              className={`grid gap-2 p-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:items-center sm:gap-6 ${
                index > 0 ? "border-t" : ""
              }`}
            >
              <p className="text-sm font-medium leading-6">{row.claim}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground sm:justify-end">
                {row.evidence.map((item) => (
                  <EvidenceLink key={item.href} href={item.href}>
                    {item.label}
                  </EvidenceLink>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="boundaries-title" className="space-y-6">
        <SectionHeading
          id="boundaries-title"
          eyebrow="Current boundaries"
          title="What this project does not claim"
          description="The implemented critical path is real; release and product-completeness work remains deliberately separate."
        />

        <ul className="grid gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          <li className="rounded-xl border bg-card p-4">
            Feed remains a placeholder, and protected account deletion is still
            pending as Task 19.
          </li>
          <li className="rounded-xl border bg-card p-4">
            Catalog cache is in memory only. There is no durable offline write
            queue.
          </li>
          <li className="rounded-xl border bg-card p-4">
            The current ten-dimension schema and recovery work were not staged
            or deployed. Production recovery-host configuration, TestFlight,
            App Store work, and release QA remain later tasks.
          </li>
          <li className="rounded-xl border bg-card p-4">
            This case study makes no claim about production users, traffic,
            scale, uptime, or a store launch.
          </li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Current scope and task status: {" "}
          <EvidenceLink href={EVIDENCE.tasks}>docs/TASKS.md</EvidenceLink>.
        </p>
      </section>

      <footer className="flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to portfolio
        </Link>
        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Browse the repository
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </footer>
    </main>
  );
}
