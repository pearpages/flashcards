# Contributing

Thanks for helping. Most contributions are deck content — a new card, a better drawing, a
fixed description — and need no React at all.

## Before you start

- Read [principles.md](principles.md): the rules every change follows (content is data,
  mobile first, no inline styles, reduced motion respected).
- For anything bigger than a card or a fix, open an issue first so we can agree on the
  approach.

## Set up

```bash
pnpm install
pnpm dev        # http://localhost:5173, also reachable from your phone on the same network
```

Node 22 (see `.nvmrc`) and pnpm are required.

## Adding or fixing cards

Edit `src/decks/<deck>/cards.json` and drop drawings in `src/decks/<deck>/images/`. The
[README](README.md#adding-cards) lists every field, length limit and image variant.

## Checks

Run these before opening a pull request; CI runs the same:

```bash
pnpm validate     # deck JSON and images
pnpm lint
pnpm test --run
pnpm build
```

Check UI changes at 375px wide and on desktop.

## Pull requests

- One topic per pull request, with a short description of what and why.
- Update [tasks.md](tasks.md), and [architecture.md](architecture.md) or the README when
  behaviour changes.
- Commit messages are short, lowercase and say what changed (`add tooltip card`).

## Conduct and security

Follow the [code of conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately as
described in [security.md](security.md), never in a public issue.
