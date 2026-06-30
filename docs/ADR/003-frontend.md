# ADR-003: Frontend — Migracja Angular → React (CodeFixer AI)

**Data:** 2026-06-30
**Status:** Accepted (zastępuje poprzedni ADR-003 Angular + Angular Material)

---

## 1. Decyzja

Zastąpiono Angular (Angular Material + ngx-markdown) przez **React 19 + TypeScript + Vite** z czystym CSS i własnym design systemem NBP.

## 2. Uzasadnienie

| Kryterium | Angular | React + Vite |
|---|---|---|
| SSE streaming | Custom pipe, złożony | Natywny fetch + ReadableStream |
| Bundle size | ~300KB+ (Material) | <100KB (brak deps CSS) |
| Czas startu (dev) | ~4s (AOT) | <500ms (Vite HMR) |
| NBP design system | Material override (skomplikowane) | Czyste CSS variables (proste) |
| Reasoning panel | Custom (złożony) | Prosty collapsible komponent |
| Kurs AI | Bardziej złożony setup | Szybszy do pokazania live |

## 3. Struktura

```
app/frontend/
  src/
    components/
      Header/          # NBP navy header z logo seal
      ChatWindow/      # Lista wiadomości z auto-scroll
      MessageBubble/   # User/assistant bubble + code blocks
      ReasoningPanel/  # Collapsible reasoning tokens panel
      CodeInput/       # Textarea kod + stack trace + language select
    hooks/
      useChat.ts       # Stan czatu, SSE streaming
    services/
      api.ts           # streamChat() przez fetch + ReadableStream
    types/
      index.ts         # ChatMessage, Language, SendMessagePayload
    styles/
      globals.css      # CSS variables NBP design tokens
```

## 4. Design system (NBP tokens)

```css
--color-navy: #152E52;    /* header, headings */
--color-blue: #4A74B0;    /* buttons, links */
--color-gold: #BDAD7D;    /* logo, accents */
--font-heading: "Brygada 1918", Georgia, serif;
--font-body: "Libre Franklin", Arial, sans-serif;
```

## 5. SSE streaming pattern

```
POST /api/chat (gateway :3001)
  → event: reasoning  data: {"token": "Analizuję..."}
  → event: token      data: {"token": " def"}
  → event: done       data: {"sessionId": "..."}
```

Frontend aktualizuje stan immutably w `useChat` hook — reasoning tokens trafiają do `ReasoningPanel`, właściwa odpowiedź do `MessageBubble.content`.

## 6. Vite proxy

```typescript
proxy: { '/api': { target: 'http://localhost:3001' } }
```

## 7. Uruchomienie

```bash
cd app/frontend
npm install
npm run dev    # :5173
npm run build
```
