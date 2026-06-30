import json
from typing import AsyncGenerator

from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from app.chains.codefixer_chain import stream_code_fix
from app.models.schemas import ChatRequest

router = APIRouter()


async def _event_generator(request: ChatRequest) -> AsyncGenerator[dict, None]:
    async for event_type, text in stream_code_fix(request):
        if event_type == "reasoning":
            yield {"event": "reasoning", "data": json.dumps({"token": text})}
        elif event_type == "token":
            yield {"event": "token", "data": json.dumps({"token": text})}
        elif event_type == "done":
            yield {"event": "done", "data": json.dumps({"provider": text, "sessionId": request.sessionId})}
        elif event_type == "error":
            yield {"event": "error", "data": json.dumps({"message": text})}


@router.post("/chat")
async def chat(request: ChatRequest) -> EventSourceResponse:
    return EventSourceResponse(_event_generator(request))


@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "version": "1.0.0"}
