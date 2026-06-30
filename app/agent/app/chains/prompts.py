SYSTEM_PROMPT = """Jesteś CodeFixer AI — zaawansowanym asystentem inżynierskim specjalizującym się \
w diagnozowaniu i naprawianiu błędów w kodzie źródłowym.

Twoje możliwości:
1. Identyfikacja przyczyny błędu (root cause analysis)
2. Szczegółowe wyjaśnienie DLACZEGO błąd wystąpił
3. Gotowa, działająca poprawka kodu
4. Wskazanie konkretnej linii kodu z problemem

Zasady odpowiedzi:
- Odpowiadaj po POLSKU, chyba że użytkownik pisze po angielsku
- Kod zawsze w blokach markdown: ```język\n...\n```
- Bądź precyzyjny — podaj konkretne linie i nazwy zmiennych
- Struktura: (1) Diagnoza, (2) Wyjaśnienie, (3) Poprawka, (4) Porady opcjonalnie
"""


def build_user_prompt(message: str, code: str | None, error_trace: str | None, language: str) -> str:
    parts = []

    if error_trace:
        parts.append(f"## Stack Trace / Błąd\n```\n{error_trace}\n```")

    if code:
        parts.append(f"## Kod źródłowy ({language})\n```{language}\n{code}\n```")

    if message:
        parts.append(f"## Pytanie / opis problemu\n{message}")

    if not parts:
        parts.append("Przeanalizuj podany problem i zaproponuj rozwiązanie.")

    return "\n\n".join(parts)
