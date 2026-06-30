from __future__ import annotations

import asyncio
import logging
from typing import AsyncGenerator

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.chains.prompts import SYSTEM_PROMPT, build_user_prompt
from app.config import settings
from app.models.schemas import ChatRequest

logger = logging.getLogger(__name__)

REASONING_STEPS = [
    "Analizuję typ błędu...",
    "Wykrywam język programowania...",
    "Przeszukuję wzorce błędów...",
    "Identyfikuję przyczynę root cause...",
    "Generuję optymalną poprawkę...",
]


def _make_openrouter_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.openrouter_model,
        api_key=settings.openrouter_api_key,  # type: ignore[arg-type]
        base_url=settings.openrouter_base_url,
        streaming=True,
        timeout=settings.timeout_seconds,
        max_retries=0,
    )


def _make_openai_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,  # type: ignore[arg-type]
        streaming=True,
        timeout=settings.timeout_seconds,
    )


async def stream_code_fix(request: ChatRequest) -> AsyncGenerator[tuple[str, str], None]:
    """
    Yields (event_type, text) tuples:
      event_type: "reasoning" | "token" | "done" | "error"
    """
    # Reasoning phase
    for step in REASONING_STEPS:
        yield ("reasoning", step + " ")
        await asyncio.sleep(0.06)

    # Choose provider
    if settings.openrouter_api_key:
        llm = _make_openrouter_llm()
        provider = "openrouter"
    elif settings.openai_api_key:
        llm = _make_openai_llm()
        provider = "openai"
    else:
        yield ("error", "Brak klucza API — ustaw OPENROUTER_API_KEY lub OPENAI_API_KEY w .env")
        return

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=build_user_prompt(
            message=request.message,
            code=request.code,
            error_trace=request.errorTrace,
            language=request.language or "other",
        )),
    ]

    retries = 0
    switched = False

    while True:
        try:
            async for chunk in llm.astream(messages):
                if chunk.content:
                    yield ("token", str(chunk.content))
            yield ("done", provider)
            return

        except Exception as exc:
            retries += 1
            logger.error("LLM error (attempt %d, provider=%s): %s", retries, provider, exc)

            if not switched and provider == "openrouter" and retries > settings.max_retries:
                if settings.openai_api_key:
                    logger.warning("Switching to OpenAI fallback")
                    llm = _make_openai_llm()
                    provider = "openai"
                    retries = 0
                    switched = True
                    continue

            if retries > settings.max_retries:
                yield ("error", f"Błąd połączenia z AI po {retries} próbach: {exc}")
                return
