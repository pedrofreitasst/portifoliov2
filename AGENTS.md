# AGENTS.md

## Project

Personal portfolio for Pedro Freitas. Next.js 14 (App Router) + TypeScript + Tailwind CSS. Deployed on Vercel (`pedrodefreitas.vercel.app`).

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build (also type-checks)
- `npm run lint` — ESLint via `next lint`
- `npm run start` — production server (after build)

No test framework. No formatter script. No separate typecheck command — `build` covers it.

## Structure

```
app/
  layout.tsx          — root layout, fonts (Inter + Cormorant Garamond), LanguageProvider
  page.tsx            — home page
  globals.css         — Tailwind base
  api/chat/route.ts   — chatbot endpoint (Groq → OpenRouter → mock fallback)
  api/chat/analytics/ — analytics API
  api/test-db/        — MongoDB connection test
  api/test-log/       — chat log test
  admin/analytics/    — analytics dashboard (password-gated)
components/
  Chatbot.tsx         — floating chatbot widget
  Header.tsx          — site header
  LanguageSelector.tsx
  sections/           — Hero, About, Projects, Contact
  ui/                 — ProjectCard, ProjectModal, SkillBar
lib/
  mongodb.ts          — Mongoose connection (cached)
  chatLogger.ts       — saves chat logs to MongoDB Atlas
  i18n.tsx            — React context i18n (no next-intl)
  projects.ts         — hardcoded project data
messages/             — translation JSONs (pt, en, es, zh)
models/               — Mongoose schemas (ChatLog)
```

## Path alias

`@/*` maps to project root (see `tsconfig.json`). Use `@/lib/...`, `@/components/...`, etc.

## Env vars

Copy `.env.local.example` → `.env.local`. Never commit `.env.local`.

Required: `MONGODB_URI`, `ANTHROPIC_API_KEY`, `WATSON_API_KEY`, `WATSON_SERVICE_URL`, `WATSON_ASSISTANT_ID`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_ADMIN_PASSWORD`.

## Gotchas

- **AI provider priority**: chatbot tries Groq first, then OpenRouter, then mock. Watson and Anthropic SDKs are installed but the README says they were swapped out due to IBM Cloud issues.
- **Behance CDN images rotate** — if a project image disappears, download it to `/public/projects/` as fallback (see `next.config.js` remotePatterns comment).
- **Custom Tailwind palette**: `ink`, `cream`, `stone`, `ember` — not standard Tailwind colors. Check `tailwind.config.ts` before adding new color classes.
- **Fonts**: Inter (`--font-sans`) and Cormorant Garamond (`--font-serif`) loaded via `next/font/google` in layout. Use CSS variables, not font names directly.
- **i18n**: Simple React context (`LanguageProvider`), not `next-intl` or i18n routing. Translations in `/messages/`. Default locale is `pt-BR`.
- **MongoDB connection** (`lib/mongodb.ts`): caches via global var for hot reload. Loads `.env.local.example` as fallback via dotenv — this is a quirk, not a bug (allows local dev without `.env.local` in some cases).
- **Admin analytics** at `/admin/analytics` — password-gated via `ADMIN_PASSWORD` env var.
- **No tests or CI** — lint before committing (`npm run lint`). Build also type-checks.
- **Vercel deploy** — region `iad1` hardcoded in `vercel.json`.
