import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
    ...nextVitals,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        '.open-next/**',
        '.content-collections/**',
        '.wrangler/**',
        '.pnpm-store/**',
        '.playwright-mcp/**',
        'next-env.d.ts',
    ]),
])

export default eslintConfig
