from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    """Application settings loaded from environment variables with validation."""
    
    # API Keys
    openai_api_key: str = Field(..., alias="OPENAI_API_KEY")
    vapi_api_key: str = Field(..., alias="VAPI_API_KEY")
    
    # Server settings
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    
    # Environment
    environment: str = Field(default="development", alias="ENVIRONMENT")
    debug: bool = Field(default=False, alias="DEBUG")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )
    
    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

# Create a global settings instance
settings = Settings() 