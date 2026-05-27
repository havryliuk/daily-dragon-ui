# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run all Jest tests
npm run test:coverage  # Run tests with coverage (80% threshold enforced on branches/functions/lines/statements)
```

To run a single test file:
```bash
npx jest src/tests/services/hskService.test.js
```

## Architecture

React 19 SPA (Vite) for a Chinese vocabulary learning app ("Daily Dragon") using an HSK-based curriculum.

**Authentication**: AWS Cognito via `aws-amplify`. The entire app is wrapped in `<Authenticator>` in `App.jsx`. `src/services/auth.js` exports `getToken()` (wraps `fetchAuthSession()`) — used by all services for Bearer tokens.

**Backend**: AWS API Gateway at `src/config.js` (`DAILY_DRAGON_API_BASE_URL`). Three services:
- `src/services/vocabularyService.js` — fetches due words (`/vocabulary/due`) and submits SRS reviews (`/vocabulary/reviews`)
- `src/services/settingsService.js` — reads/writes user settings (`/settings`); currently used to fetch `hsk_level` on app load
- `src/services/hskService.js` — fetches per-level HSK progress (`/hsk/progress`)
- `src/services/ai/aiService.js` — sentence generation and translation evaluation (`/practice/sentences`, `/practice/evaluate-translations`)

**Routing** (`react-router-dom` v7):
- `/` → `Home`
- `/progress` → `ProgressPage` (HSK level progress bars)
- `/practice` → `Practice` (state machine: WELCOME → IN_PROGRESS → REVIEW)

**HSK level state**: `App.jsx` fetches settings on load and stores `hskLevel` in state. It is passed as a prop to `Header` (badge display) and `Practice` → `PracticePage` → `getPracticeSentences` (level-aware sentence generation).

**Practice flow** (`src/components/practice/`):
1. `WelcomePage` — Start button
2. `PracticePage` — fetches due vocabulary, calls AI for sentences (with `hsk_level`), user types English translations
3. `ReviewPage` — displays AI-evaluated results; can reset to WELCOME or retry IN_PROGRESS

Sentences from the API contain `<word>` markup for the target word. `renderSentence.jsx` (shared by `PracticePage` and `ReviewPage`) splits on this pattern and renders the word in teal bold.

**UI**: Chakra UI v3 (`@chakra-ui/react`) with `defaultSystem` provider. Use `colorPalette` prop (not `colorScheme`). Toasts via `src/components/ui/toaster.jsx`.

**Testing**: Jest + `@testing-library/react`. Tests in `src/tests/` mirror `src/components/` and `src/services/`. Mock services with `jest.mock(...)`. Wrap components in `<ChakraProvider value={defaultSystem}>`. Components using `useNavigate` require a `<MemoryRouter>` wrapper. `setupTests.js` polyfills `TextEncoder`/`TextDecoder` for jsdom.