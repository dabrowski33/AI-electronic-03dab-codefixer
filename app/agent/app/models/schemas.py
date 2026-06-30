from typing import Optional, Literal
from pydantic import BaseModel

Language = Literal["python", "java", "javascript", "typescript", "go", "csharp", "other"]


class ChatRequest(BaseModel):
    sessionId: str
    message: str
    code: Optional[str] = None
    errorTrace: Optional[str] = None
    language: Optional[Language] = "other"
