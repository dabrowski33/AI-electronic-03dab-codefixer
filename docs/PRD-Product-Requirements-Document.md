# CodeFixer AI
## Product Requirements Document (PRD)

> **Projekt kursu:** "AI dla programistów — od pomysłu do MVP" | JSystems × NBP | 2026-06-22
> Stack zatwierdzony w ADR: React / Node.js / Python (LangChain) / Java (Spring Boot) / PostgreSQL

---

## 1. Cel i wizja produktu

**CodeFixer AI** to zaawansowany system czatu inżynieryjnego, którego celem jest skrócenie czasu usuwania awarii (MTTR) w procesie wytwarzania oprogramowania. Użytkownik wprowadza napotkany błąd programistyczny oraz powiązany fragment kodu, a autonomiczny system agentów AI przeprowadza wieloetapowe wnioskowanie (Chain-of-Thought Reasoning), identyfikuje optymalne rozwiązanie, testuje je w izolowanym środowisku i dostarcza gotową, zweryfikowaną poprawkę.

System łączy formalną estetykę instytucjonalną NBP z najnowocześniejszymi paradygmatami sztucznej inteligencji.

---

## 2. Grupa docelowa (Persony)

| Persona | Rola | Główna potrzeba |
|---|---|---|
| **Inżynier Oprogramowania (Wytwórca)** | Deweloper aplikacji | Precyzyjna odpowiedź „tu i teraz" — wkleja błąd i oczekuje gotowego kodu o zerowym współczynniku regresji. |
| **Architekt / Audytor Kodu (Quality Gatekeeper)** | Architect, Tech Lead | Transparentność — chce widzieć ścieżkę rozumowania modelu (Chain-of-Thought), aby ocenić bezpieczeństwo i czystość proponowanej poprawki. |

---

## 3. Kluczowe funkcjonalności

1. **Interfejs Konwersacyjny LRM** — czat z tokenami reasoning; wyświetla proces dedukcyjny przed podaniem ostatecznego wyniku (kod naprawiony).
2. **Autonomiczny Weryfikator Środowiskowy (Worker Agent)** — robot wykonawczy uruchamiany w izolowanym kontenerze, testujący poprawność semantyczną i syntaktyczną generowanego kodu.
3. **Kaskadowe Zarządzanie Modelami (Fallbacks)** — automatyczne przełączanie pomiędzy modelem głównym Hermes 3 (OpenRouter) a OpenAI GPT-4o w przypadku anomalii sieciowych lub przekroczenia limitów.
4. **Instytucjonalna Wizualizacja** — UI zaprojektowany ściśle według wytycznych NBP.pl: dominujący granat `#152E52`, akcenty złota `#BDAD7D`, typografia Brygada 1918 / Libre Franklin.

---

## 4. User Stories

### US-01: Wprowadzanie kodu i analiza błędów
> **Jako** deweloper,
> **chcę** wkleić do okna czatu nieskompilowany kod źródłowy wraz z pełnym Stack Trace,
> **aby** system natychmiastowo zidentyfikował dokładną linię kodu i przyczynę usterki.

**Kryteria akceptacji:**
- System automatycznie wykrywa język (Python, Java, JavaScript, TypeScript, Go, C#).
- Parsuje log błędu i wyróżnia linię, numer błędu i typ wyjątku.
- Czas odpowiedzi wstępnej (pierwsze tokeny) `< 1,2 s`.

---

### US-02: Przegląd ścieżki wnioskowania (Reasoning Flow)
> **Jako** architekt systemu,
> **chcę** mieć wgląd w pełną, rozwiniętą strukturę myślową agenta AI (reasoning tokens),
> **aby** zrozumieć, dlaczego dana poprawka jest optymalna pod względem wydajności i bezpieczeństwa.

**Kryteria akceptacji:**
- UI udostępnia dedykowany, zwijany panel **„Proces Myślowy Agenta"** sformatowany w palecie NBP.
- Panel prezentuje etapy eliminacji hipotez błędnych w czasie rzeczywistym (streaming).
- Można rozwinąć/zwinąć panel bez utraty kontekstu konwersacji.

---

### US-03: Automatyczna walidacja kodu przez Agenta Robotnika
> **Jako** inżynier DevOps,
> **chcę**, aby wygenerowany kod był automatycznie przetestowany w izolowanym środowisku przez Worker Agent,
> **aby** mieć pewność, że proponowana zmiana nie zawiera błędów syntaktycznych ani runtime.

**Kryteria akceptacji:**
- Kod uruchamiany jest w piaskownicy (sandbox) bez dostępu do hosta.
- Wynik (success/failure + stdout/stderr) zwracany jest do interfejsu jako metadane systemowe.
- Status walidacji wyświetlany jest jako odznaka (badge) przy poprawce.

---

### US-04: Odporność na awarie dostawców LLM (Failover)
> **Jako** menedżer utrzymania systemu,
> **chcę**, aby w przypadku niedostępności OpenRouter (Hermes 3) zapytania były automatycznie przekierowywane do OpenAI GPT-4o,
> **aby** zagwarantować nieprzerwaną pracę zespołu deweloperskiego.

**Kryteria akceptacji:**
- Przełączenie następuje automatycznie w warstwie agenta Python po 2 nieudanych próbach (timeout `> 3,0 s`).
- Incydent jest logowany do bazy PostgreSQL z timestampem, dostawcą i przyczyną błędu.
- Użytkownik nie widzi przerwy — odpowiedź jest kontynuowana bez żadnego komunikatu o błędzie.

---

## 5. Wymagania niefunkcjonalne

| ID | Wymaganie | Wartość docelowa |
|---|---|---|
| NFR-01 | Czas do pierwszego tokenu (TTFT) | `< 800 ms` od wysłania zapytania |
| NFR-02 | Izolacja środowiska Worker | Kod użytkownika nie może uzyskać dostępu do zasobów hosta |
| NFR-03 | Dostępność (SLA) | `99,95%` w ujęciu miesięcznym |
| NFR-04 | Bezpieczeństwo API key | Klucz OpenRouter/OpenAI nigdy nie dociera do przeglądarki |
| NFR-05 | Streaming | Renderowanie token-by-token poprzez SSE |

---

## 6. KPI i kryteria sukcesu

| KPI ID | Metryka | Wartość docelowa | Metoda pomiaru |
|---|---|---|---|
| KPI-01 | Fix Accuracy Ratio | `> 82%` poprawnych kompilacji za 1. razem | Automatyczne logi z Worker Agent |
| KPI-02 | Mean Time to Resolution (MTTR) | `< 45 s` na pełną pętlę naprawczą | Telemetria Node.js Gateway |
| KPI-03 | Weekly Retention (technical users) | `> 45%` aktywnych deweloperów po 4 tygodniach | Analityka sesji w PostgreSQL |

---

## 7. Architektura — przegląd komponentów

Pełna specyfikacja techniczna w `docs/ADR/`. Skrót:

| Komponent | Technologia | Port | Rola |
|---|---|---|---|
| Frontend | React 19 + TypeScript + Vite | 5173 (dev) | Chat UI, reasoning panel, NBP design system |
| Gateway (BFF) | Node.js 22 + Express | 3001 | Auth, session, routing HTTP/SSE → Agent |
| AI Agent | Python 3.12 + FastAPI + LangChain | 8000 | LLM orchestration, failover, streaming |
| Backend (Enterprise) | Java 21 + Spring Boot 3.5 | 8080 | Code parsing (AST), audit logs, PostgreSQL persistence |
| Database | PostgreSQL 16 | 5432 | Sessions, chat history, LLM audit logs |

---

## 8. Identyfikacja wizualna

Szczegóły w `docs/design-guidelines.md`. Kluczowe tokeny:

| Token | Wartość | Użycie |
|---|---|---|
| NBP Navy | `#152E52` | Header, headings, dark sections |
| NBP Blue (accent) | `#4A74B0` | Buttons, links, interactive |
| Logo Gold | `#BDAD7D` | Emblem, prestige accents |
| Background | `#FFFFFF` / `#F7F7F7` | App background / card bg |
| Heading font | Brygada 1918 (serif) | All h1–h3 |
| Body font | Libre Franklin (sans) | Body, UI, inputs |

---

## 9. Plan SDLC (6-miesięczny, metodyka Scrum)

### Faza 1: Inicjacja i architektura (Miesiące 1–2)
- Makiety UX/UI w Figma (NBP color scheme)
- Schemat relacyjny PostgreSQL
- Monorepo setup: React, Node.js, Python, Java

### Faza 2: Implementacja (Miesiące 3–4)

| Sprinty | Obszar | Zakres |
|---|---|---|
| Sprint 1–2 | Gateway + PostgreSQL + React scaffold | CI/CD (GitHub Actions), auth w Node.js, tabele sesji/audytu, layout NBP w React |
| Sprint 3–4 | AI Agent (Python + LangChain) | Graf agentowy LangGraph, integracja OpenRouter (Hermes 3) + failover OpenAI, streaming tokenów |
| Sprint 5–6 | Java Gateway + Worker Integration | Mikrousługa Java z LangChain4j, Worker Agent execution pipeline, Self-Correction Loop |

### Faza 3: Testy i QA (Miesiąc 5)
- Pokrycie kodu ≥ 85% (Python, Java)
- Penetration testing izolacji kontenerów (RCE)
- Closed Beta: 500 inżynierów

### Faza 4: Wdrożenie produkcyjne (Miesiąc 6)
- Konteneryzacja Docker + Kubernetes
- Monitoring: Datadog + Firebase Performance
- Przekazanie do utrzymania
