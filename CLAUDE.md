# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Claude Code Instructions

- Use Context7 MCP (`resolve-library-id` + `query-docs`) for any library used in the project.
- Use proactively below sub-agents:
  - fe-developer
  - be-developer
  - qa-engineer

## Project

**CodeFixer AI** — inteligentny asystent debugowania kodu z architekturą poliglotyczną.

Stack (zatwierdzony w ADR):
- **Frontend:** React 19 + TypeScript + Vite (`app/frontend/`) → port 5173
- **Gateway (BFF):** Node.js 22 + Express (`app/gateway/`) → port 3001
- **AI Agent:** Python 3.12 + FastAPI + LangChain (`app/agent/`) → port 8000
- **Backend:** Java 21 + Spring Boot 3.5 (`app/backend/`) → port 8080
- **Database:** PostgreSQL 16 → port 5432

## Context7 MCP Library IDs

| Library | Context7 ID |
|---|---|
| React | `/facebook/react` |
| Vite | `/vitejs/vite` |
| LangChain (Python) | `/langchain-ai/langchain` |
| FastAPI | `/tiangolo/fastapi` |
| Express | `/expressjs/express` |
| Spring Boot | `/spring-projects/spring-boot` |
| openai-java | `/openai/openai-java` |

## Uruchomienie lokalne (dev)

```bash
# 1. Skopiuj zmienne środowiskowe
cp .env.example .env
# Uzupełnij OPENROUTER_API_KEY lub OPENAI_API_KEY

# 2. Python Agent
cd app/agent && pip install -r requirements.txt && python main.py

# 3. Node.js Gateway
cd app/gateway && npm install && npm run dev

# 4. React Frontend
cd app/frontend && npm install && npm run dev

# 5. Java Backend (opcjonalnie)
cd app/backend && ./mvnw spring-boot:run
```

## Docker Compose (cały stack)

```bash
docker compose -f app/docker-compose.yml up --build
```

## Kluczowe dokumenty

- `docs/PRD-Product-Requirements-Document.md` — wymagania produktowe
- `docs/ADR/` — Architecture Decision Records
- `docs/design-guidelines.md` — NBP design system i tokeny
