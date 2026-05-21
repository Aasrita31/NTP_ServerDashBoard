from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .services.ntp_service import get_office_ntp_time
from .config import settings
from .routers import utc, nodes
from .websocket import live

app = FastAPI(
    title=settings.app_name,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(utc.router)
app.include_router(nodes.router)
app.include_router(live.router)

@app.get("/")
async def root():
    return {
        "service": settings.app_name,
        "endpoints": [
            "/api/utc",
            "/api/nodes",
            "/api/node/{country}",
            "/ws/live",
            "/ntp"
        ],
    }

@app.get("/ntp")
def ntp_data():
    return get_office_ntp_time()