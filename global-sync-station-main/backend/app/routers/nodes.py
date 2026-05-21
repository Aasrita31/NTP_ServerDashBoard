from fastapi import APIRouter, HTTPException

from ..services.nodes_data import COUNTRIES, find_country
from ..services.metrics import render_node_state

router = APIRouter(prefix="/api", tags=["nodes"])


@router.get("/nodes")
async def list_nodes():
    return [render_node_state(c) for c in COUNTRIES]


@router.get("/node/{country}")
async def get_node(country: str):
    node = find_country(country)
    if not node:
        raise HTTPException(status_code=404, detail=f"Unknown node: {country}")
    return render_node_state(node)


@router.get("/health")
async def health():
    healthy = sum(1 for c in COUNTRIES)
    return {"status": "ok", "nodes_total": len(COUNTRIES), "nodes_online": healthy}
