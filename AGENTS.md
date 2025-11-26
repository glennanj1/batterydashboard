# AGENTS.md

## Build/Lint/Test Commands
- `npm run dev` - Start dev server on port 3002
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- No test framework configured

## Tech Stack
Next.js 16, React 19, TypeScript (strict mode), Tailwind CSS v4, Drizzle ORM, NextAuth v5

## Code Style
- Use `@/*` path alias for imports from `src/` (e.g., `@/components/ui/button`)
- Order imports: React/Next, external libs, internal `@/` imports
- Use `"use client"` directive only for client components; prefer server components
- Use `"use server"` for server actions in dedicated files or inline
- Tailwind for styling; use `cn()` from `@/lib/utils` for conditional classes
- shadcn/ui components in `src/components/ui/`; custom components alongside

## TypeScript
- Strict mode enabled; avoid `any` (use explicit types or `unknown`)
- Use `interface` for component props, `type` for unions/utilities
- Prefer camelCase for variables/functions, PascalCase for components/types

## Error Handling
- Server: try/catch with `console.error`, return error objects (not throw in actions)
- Client: handle errors in UI with user-friendly messages
