from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NTP Server"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:8083",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
        "http://127.0.0.1:8083",
    ]
    tick_interval_seconds: float = 0.1
    # Office NTP server (set to empty to disable). Can be IP or hostname.
    office_ntp_host: str = "10.26.13.44"
    office_ntp_label: str = "IITTNIF"
    office_ntp_port: int = 123

    class Config:
        env_file = ".env"


settings = Settings()
