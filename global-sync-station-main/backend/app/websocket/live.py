import asyncio
import json
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..config import settings
from ..services.nodes_data import COUNTRIES
from ..services.metrics import render_node_state
from ..routers.utc import query_ntp

router = APIRouter()


@router.websocket("/ws/live")
async def ws_live(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            now = datetime.now(timezone.utc)
            office = None
            if settings.office_ntp_host:
                office = query_ntp(settings.office_ntp_host, getattr(settings, "office_ntp_port", 123))
                if office:
                    office["label"] = settings.office_ntp_label

            payload = {
                "type": "tick",
                "utc": {
                    "iso": now.isoformat(),
                    "epoch_ms": int(now.timestamp() * 1000),
                },
                "nodes": [render_node_state(c) for c in COUNTRIES],
            }

            if office:
                payload["utc"]["office"] = office

            await ws.send_text(json.dumps(payload))
            await asyncio.sleep(settings.tick_interval_seconds)
    except WebSocketDisconnect:
        return
