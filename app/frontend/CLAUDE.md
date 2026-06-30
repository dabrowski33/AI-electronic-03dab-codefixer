# CLAUDE.md — Frontend (React + Vite + TypeScript)

## Stack
- React 19 + TypeScript + Vite 5
- Czyste CSS (CSS custom properties, no framework)
- NBP design system (navy #152E52, gold #BDAD7D)

## Development
```bash
npm install
npm run dev    # dev server na :5173
npm run build  # production build
```

## Proxy
`/api` → `http://localhost:3001` (Node.js Gateway)

## Design tokens
Zdefiniowane jako CSS variables w `src/styles/globals.css`. Użyj `var(--color-navy)` etc.

## SSE streaming
- `src/services/api.ts` — streamChat() obsługuje SSE
- Events: `reasoning` (reasoning tokens), `token` (odpowiedź), `done`, `error`
- `src/hooks/useChat.ts` — zarządza stanem czatu
