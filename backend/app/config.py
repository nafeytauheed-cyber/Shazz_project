from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Sherpa"
    environment: str = "development"
    database_url: str = "sqlite:///./app.db"
    jwt_secret: str = "dev-secret"
    answer_model: str = "claude-sonnet-5"
    fast_model: str = "claude-haiku-4-5-20251001"
    anthropic_api_key: str = ""
    frontend_url: str = "http://localhost:3000"
    stale_days: int = 365
    avg_minutes_saved: int = 6
    demo_mode: bool = True
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
