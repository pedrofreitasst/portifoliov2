# Type scale

Base **20px**, ratio **1.25** (major third).

Fonts: display **Fraunces** (variable, opsz) and body **Sora** (variable, wght 100-800), both via next/font in `app/layout.tsx`. Display sizes were scaled about 0.82x when Fraunces replaced Darker Grotesque (Fraunces has a much taller cap height and x-height). Body sizes went 20 -> 19 when Sora replaced Jost (larger x-height, wider). Nav, footer links/copyright, Ori input and suggestions use Sora; headings and small uppercase labels use Fraunces.

| Token | px (approx) | Use |
|---|---|---|
| `text-meta` | 14 | copyright / tiny labels |
| `text-body` / `text-base` / `text-sm`* | 19 | body, hero sub, chips |
| `text-nav` | 20 (16 below sm for nav, below md for footer) | nav, footer links + copyright |
| `text-ui-lg` | 22 | footer links, Let’s Talk |
| `text-title` | 24 | project titles |
| `text-section` / `text-section-lg` | 26-36 | section heads |
| `text-display` | 36-56 | hero H1 |

\* `text-sm` / `text-base` remapped to 19 on this project so nothing important sits at the old 14/16 defaults.

Hero “Made for you, with love.” shares `text-body` with a `<br />`.
