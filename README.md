# Flashcards

A minimal, beautifully animated flashcard app with a mobile-first card stack UI.

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Framer Motion** — card stack animations, swipe gestures, spring physics
- **Plain CSS** — no utility frameworks
- **pnpm** — package manager

## Requirements

- Node.js >= 18
- pnpm

## Features

- **Card stack UI** — current card on top with stacked cards peeking behind for depth
- **Tap to reveal** — tap/click a card to show the description; tap again to dismiss
- **Swipe navigation** — swipe left/right to navigate between cards
- **Keyboard navigation** — left/right arrow keys
- **Mobile-first design** — full-width on mobile, centered and constrained on desktop
- **Spring animations** — natural card movement with Framer Motion spring physics
- **Boundary stops** — navigation stops at first and last card

## Data Format

Flashcards are stored in `src/flashcards.json`:

```json
[
  {
    "id": 1,
    "title": "Card Title",
    "image": "https://example.com/image.png",
    "description": "The answer or explanation text"
  }
]
```

| Field         | Required | Description                          |
| ------------- | -------- | ------------------------------------ |
| `id`          | Yes      | Unique numeric identifier            |
| `title`       | Yes      | Displayed on the card front          |
| `image`       | No       | URL to an image, or `null`           |
| `description` | Yes      | Revealed on tap/click                |

## Deployment

The app is automatically built and published to **GitLab Pages** on every push to `main`.

Live at: https://pere.pages.gitlab.ocado.tech/flashcards/

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```
