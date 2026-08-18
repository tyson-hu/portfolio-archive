# Tianzhe "Tyson" Hu — Portfolio

Recruiter-facing portfolio for Tianzhe "Tyson" Hu, a software engineer focused on backend, full-stack, and developer tooling work.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Radix UI primitives
- OpenNext for Cloudflare configuration

## Local development

Requirements: Node.js 20.9 or newer and pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Deployment status

The repository contains OpenNext and Cloudflare configuration. Publishing or merging repository changes does not itself establish or perform a production deployment.

The isolated Cloudflare development Worker is deployed with:

```bash
pnpm deploy:cf:dev
```

This targets the named Wrangler `dev` environment (`tianzhe-portfolio-dev`) and does not update the default production Worker.

## License

This project is available under the [MIT License](./LICENSE). It retains the original template attribution and identifies subsequent portfolio modifications separately.
