# Stage 1 — portfolio skeleton

English-only, high-contrast black/white. Orange exists only on the home logo.

## Why these choices

- **Full-click cards over small CTAs.** PERSONAL and CASE STUDIES are entire hit targets so a recruiter can scan and click without hunting a button.
- **Search in the hero over a FAB.** Asking is part of the page, not a floating afterthought. Better on mobile. The old `Chatbot.tsx` file and `/api/chat` stay in the repo; they are just not mounted on the home page.
- **Logo = home, not a chat launcher.** The orange smiley always returns to `/`.
- **High contrast B/W + orange only on the logo.** One accent. Everything else is type and space.
- **Stepped name roller.** Pedro ↔ Sani every ~2.2s with a hard cut. Personality without a fluid morph gimmick. Starts on Pedro.

## Resume

Header links to `/resume.pdf`. Drop the file in `public/resume.pdf` when you have it. Until then that route 404s.

## Still placeholder

- About bio is honest filler — replace when the skeleton is locked.
- Work routes are stubs. No invented case copy.
