from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "nousresearch/hermes-3-llama-3.1-405b"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o"

    port: int = 8000
    max_retries: int = 2
    timeout_seconds: float = 30.0

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
