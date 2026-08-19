import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Github,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import { ContactFooter } from "@/components/portfolio/contact-footer";
import { SiteHeader } from "@/components/portfolio/site-header";

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
      { label: "Catalog and reconnect evidence", href: EVIDENCE.task15Evidence },
      { label: "API contract", href: EVIDENCE.apiContracts },
    ],
  },
  {
    claim: "Email/password identity, session restore, and cache isolation",
    evidence: [
      { label: "Auth and session evidence", href: EVIDENCE.task16Evidence },
      { label: "AuthProvider", href: EVIDENCE.authProvider },
    ],
  },
  {
    claim: "Durable create/edit ratings and explicit save failures",
    evidence: [
      { label: "Rating persistence evidence", href: EVIDENCE.task17Evidence },
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
      { label: "Password recovery evidence", href: EVIDENCE.task18Evidence },
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

const PROOF_HIGHLIGHTS = [
  {
    label: "Security",
    description: "Owner-scoped PostgreSQL RLS and least-privilege access.",
    icon: ShieldCheck,
  },
  {
    label: "Verification",
    description: "Automated frontend, database, auth, and concurrency evidence.",
    icon: CheckCircle2,
  },
  {
    label: "Reliability",
    description: "Accepted physical-device offline, reconnect, and failure validation.",
    icon: RefreshCcw,
  },
] as const;

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
      className="case-study-evidence-link"
    >
      {children}
      <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden />
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
    <div className="case-study-section-heading">
      <p className="case-study-section-heading__eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default function EazyReviewProofPage() {
  return (
    <>
      <span className="portfolio-top-anchor" id="top" tabIndex={-1} />
      <SiteHeader sectionHrefPrefix="/" />
      <main className="portfolio-page case-study-page">
        <article className="case-study-shell">
          <header className="case-study-hero case-study-reading-column">
            <Link className="case-study-back-link" href="/">
              <ArrowLeft size={16} strokeWidth={2.25} aria-hidden />
              Portfolio
            </Link>

            <p className="case-study-hero__orientation">
              Independent Engineering Case Study
            </p>
            <h1>Eazy Review</h1>
            <p className="case-study-hero__summary">
              A React Native product-review system that keeps owner-scoped data
              behind PostgreSQL RLS, derives scores on the server, and makes
              connected failures recoverable.
            </p>

            <ul aria-label="Core technology stack" className="case-study-stack">
              {STACK.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>

            <div className="case-study-actions">
              <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-action case-study-action--primary"
              >
                <Github size={16} strokeWidth={2.25} aria-hidden />
                GitHub repository
              </a>
              <a
                href="#verification"
                className="case-study-action case-study-action--secondary"
              >
                How I verified it
                <ArrowDown size={16} strokeWidth={2.25} aria-hidden />
              </a>
            </div>

            <ul aria-label="Engineering proof highlights" className="case-study-proof-strip">
              {PROOF_HIGHLIGHTS.map(({ label, description, icon: Icon }) => (
                <li key={label}>
                  <Icon size={18} strokeWidth={2.1} aria-hidden />
                  <div>
                    <p className="case-study-proof-strip__label">{label}</p>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="case-study-audit-note">
              Evidence audited against commit{" "}
              <EvidenceLink href={EVIDENCE.commit}>7214932</EvidenceLink>.
            </p>
          </header>

          <section
            aria-labelledby="architecture-title"
            className="case-study-section case-study-reading-column"
          >
            <SectionHeading
              id="architecture-title"
              eyebrow="Architecture"
              title="Clear ownership at each boundary"
              description="Expo Router owns navigation and screen behavior. TanStack Query manages connected catalog and rating query state where applicable; Supabase Auth operations call the Auth SDK directly. PostgreSQL owns catalog, personal rating, and aggregate state behind RLS and trigger functions."
            />

            <div
              aria-label="Eazy Review architecture responsibility flow"
              className="case-study-architecture"
            >
              <div className="case-study-architecture__node">
                <p className="case-study-architecture__index">01 · Client</p>
                <h3>React Native + Expo Router</h3>
                <p>Navigation, rendering, form state, and client-side validation.</p>
              </div>
              <ArrowDown className="case-study-architecture__arrow" size={16} aria-hidden />
              <div className="case-study-architecture__node">
                <p className="case-study-architecture__index">02 · Connected state</p>
                <h3>TanStack Query + NetInfo</h3>
                <p>
                  Query lifecycle, public versus owner-scoped cache keys,
                  reconnect/refetch behavior, and post-write invalidation. Auth is
                  not routed through this layer.
                </p>
              </div>
              <ArrowDown className="case-study-architecture__arrow" size={16} aria-hidden />
              <div className="case-study-architecture__node">
                <p className="case-study-architecture__index">03 · Shared service client</p>
                <h3>Supabase JavaScript client</h3>
                <p>
                  One typed client issues PostgreSQL Data API requests and direct
                  Supabase Auth calls.
                </p>
              </div>
              <ArrowDown className="case-study-architecture__arrow" size={16} aria-hidden />
              <div className="case-study-architecture__split">
                <div className="case-study-architecture__node">
                  <p className="case-study-architecture__index">04A · Identity</p>
                  <h3>Supabase Auth</h3>
                  <p>
                    Email/password identity, local session lifecycle, and verified
                    password-recovery state.
                  </p>
                </div>
                <div className="case-study-architecture__node">
                  <p className="case-study-architecture__index">04B · Data boundary</p>
                  <h3 className="case-study-architecture__database-title">
                    <Database size={16} aria-hidden />
                    PostgreSQL
                  </h3>
                  <p>
                    Published catalog, owner ratings, and trigger-derived aggregates.
                    Explicit grants and RLS gate access at the row and column boundary.
                  </p>
                </div>
              </div>
            </div>

            <p className="case-study-supporting-link">
              Inspect the{" "}
              <EvidenceLink href={EVIDENCE.apiContracts}>client contracts</EvidenceLink>{" "}
              and <EvidenceLink href={EVIDENCE.dataModel}>data boundary</EvidenceLink>.
            </p>
          </section>

          <section
            aria-labelledby="decisions-title"
            className="case-study-section case-study-reading-column"
          >
            <SectionHeading
              id="decisions-title"
              eyebrow="Three engineering decisions"
              title="The choices that carry the most risk"
              description="Each decision connects a product or security problem to an implementation boundary, automated proof, and an explicit limit."
            />

            <div className="case-study-decisions">
              {DECISIONS.map((decision) => (
                <article key={decision.number} className="case-study-decision">
                  <p className="case-study-decision__number">{decision.number}</p>
                  <div className="case-study-decision__body">
                    <h3>{decision.title}</h3>
                    <div className="case-study-decision__record">
                      <p><strong>Problem — </strong>{decision.problem}</p>
                      <p><strong>Decision — </strong>{decision.decision}</p>
                      <p><strong>Why — </strong>{decision.why}</p>
                      <p><strong>Verification — </strong>{decision.verification}</p>
                      <p><strong>Boundary — </strong>{decision.boundary}</p>
                    </div>
                    <div className="case-study-decision__links">
                      {decision.links.map((link) => (
                        <EvidenceLink key={link.href} href={link.href}>
                          {link.label}
                        </EvidenceLink>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="verification"
            aria-labelledby="verification-title"
            className="case-study-section case-study-reading-column"
          >
            <SectionHeading
              id="verification-title"
              eyebrow="Verification"
              title="How I verified it"
              description="The proof is intentionally layered: current implementation and focused tests, database behavior, dated accepted device evidence, and CI definitions."
            />

            <ul className="case-study-verification">
              {VERIFICATION_ROWS.map((row) => (
                <li key={row.claim}>
                  <p>{row.claim}</p>
                  <div>
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

          <section
            aria-labelledby="boundaries-title"
            className="case-study-section case-study-reading-column"
          >
            <SectionHeading
              id="boundaries-title"
              eyebrow="Current boundaries"
              title="What this project does not claim"
              description="The implemented critical path is real; release and product-completeness work remains deliberately separate."
            />

            <ul className="case-study-boundaries">
              <li>
                Feed remains a placeholder, and protected account deletion is still
                pending as Task 19.
              </li>
              <li>
                Catalog cache is in memory only. There is no durable offline write
                queue.
              </li>
              <li>
                The current ten-dimension schema and recovery work were not staged
                or deployed. Production recovery-host configuration, TestFlight,
                App Store work, and release QA remain later tasks.
              </li>
              <li>
                This case study makes no claim about production users, traffic,
                scale, uptime, or a store launch.
              </li>
            </ul>

            <p className="case-study-supporting-link">
              Current scope and task status: {" "}
              <EvidenceLink href={EVIDENCE.tasks}>docs/TASKS.md</EvidenceLink>.
            </p>
          </section>

          <div className="case-study-return case-study-reading-column">
            <Link href="/">
              <ArrowLeft size={16} strokeWidth={2.25} aria-hidden />
              Back to portfolio
            </Link>
          </div>
        </article>
      </main>
      <ContactFooter compact />
    </>
  );
}
