from pydantic import BaseModel
from typing import Literal


class NodeStatic(BaseModel):
    flag: str
    iso: str
    name: str
    code: str
    tz: str
    offsetLabel: str
    accent: str
    peer: str
    refid: str
    stratum: Literal[1, 2]
    baseRtt: float
    baseDrift: float
    poll: int


class NodeMetrics(BaseModel):
    delayMs: str
    offsetMs: str
    jitterMs: str
    pdvMs: str
    driftPpm: str
    reach: str
    pollS: int
    holdover: bool
    qualityLabel: Literal["LOCKED", "NOMINAL", "DRIFT", "HOLDOVER"]


class NodeState(NodeStatic):
    time: str
    date: str
    metrics: NodeMetrics


class UTCState(BaseModel):
    iso: str
    epoch_ms: int
    stratum: int
    refid: str
    leap: str
