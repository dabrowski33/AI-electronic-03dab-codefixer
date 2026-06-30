# ADR-005: Gateway — Node.js Express BFF

**Data:** 2026-06-30
**Status:** Accepted (nowy komponent)

---

## 1. Decyzja

Dodano **Node.js 22 + Express** jako BFF (Backend-For-Frontend) na porcie 3001 między React frontendem a Python agentem.

## 2. Uzasadnienie

Warstwa Gateway rozdziela odpowiedzialności:
- Frontend nie musi znać adresu agenta Python
- Session management w jednym miejscu
- Możliwość dodania auth bez zmian w agencie
- SSE proxy z transparentnym przekazywaniem chunków

## 3. Architektura

```
React :5173  →  Gateway :3001  →  Agent :8000
              ↕ SessionStore
```

## 4. Endpointy

| Endpoint | Metoda | Opis |
|---|---|---|
| `/api/chat` | POST | SSE proxy → Python Agent |
| `/api/health` | GET | Health check |
| `/api/sessions/:id` | GET | Historia sesji (in-memory) |

## 5. Session management

In-memory `Map<string, Session>` — wystarczający dla MVP.
Persistencja do PostgreSQL (przez Java backend) w przyszłości.

## 6. SSE proxy pattern

```typescript
// Transparentne przekazanie SSE stream
const reader = agentResponse.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  res.write(decoder.decode(value, { stream: true }));
}
```

## 7. Uruchomienie

```bash
cd app/gateway
cp .env.example .env
npm install
npm run dev    # :3001
```
