"""Realistic NTP metric synthesizer — mirrors RFC 5905 / ITU-T G.8273
heuristics used by the React UI."""
from datetime import datetime, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
import time

from ..utils.seeded import seeded


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def compute_metrics(node: dict, tick: int | None = None) -> dict:
    if tick is None:
        tick = int(time.time())

    code = node["code"]
    stratum = node["stratum"]
    base_rtt = node["baseRtt"]
    base_drift = node["baseDrift"]
    poll = node.get("poll", 8)

    is_intercontinental = base_rtt >= 80.0
    jitter_scale = base_rtt * 0.035 + 0.8 if is_intercontinental else base_rtt * 0.06 + 0.25
    delay = max(0.4, base_rtt + seeded(code + "rtt", tick) * jitter_scale)

    off_rand = seeded(code + "off", tick)
    slow_wander = seeded(code + "ofw", tick // 11) * 0.4
    offset_raw = (off_rand * 0.42 + slow_wander * 0.08) if stratum == 1 else (off_rand * 2.4 + slow_wander * 0.6)
    offset = _clamp(offset_raw, -3.0, 3.0)

    j_base = 0.08 if stratum == 1 else 0.35
    j_scale = 0.35 if stratum == 1 else 0.95
    jitter = abs(seeded(code + "jit", tick)) * j_scale + j_base

    pdv = abs(seeded(code + "pdv", tick)) * (2.4 if is_intercontinental else 0.8) + 0.05

    drift = base_drift + seeded(code + "drf", tick // 8) * 0.12

    drop_roll = seeded(code + "rch", tick // 17)
    reach = 0o377
    if drop_roll > 0.82:
        reach = 0o376
    elif drop_roll < -0.9:
        reach = 0o375

    holdover = seeded(code + "ho", tick // 23) > 0.94

    abs_offset = abs(offset)
    lock_thr = 0.15 if stratum == 1 else 1.0
    nom_thr = 0.40 if stratum == 1 else 2.2
    if holdover:
        quality = "HOLDOVER"
    elif abs_offset < lock_thr:
        quality = "LOCKED"
    elif abs_offset < nom_thr:
        quality = "NOMINAL"
    else:
        quality = "DRIFT"

    return {
        "delayMs":  f"{delay:.2f}",
        "offsetMs": f"{'+' if offset >= 0 else ''}{offset:.3f}",
        "jitterMs": f"{jitter:.3f}",
        "pdvMs":    f"{pdv:.3f}",
        "driftPpm": f"{'+' if drift >= 0 else ''}{drift:.3f}",
        "reach":    format(reach, "03o"),
        "pollS":    1 << poll,
        "holdover": holdover,
        "qualityLabel": quality,
    }


def render_node_state(node: dict, tick: int | None = None) -> dict:
    if tick is None:
        tick = int(time.time())
    try:
        tz = ZoneInfo(node["tz"])
    except ZoneInfoNotFoundError:
        tz = timezone.utc
    now = datetime.fromtimestamp(tick, tz=tz)
    return {
        **node,
        "time": now.strftime("%H:%M:%S"),
        "date": now.strftime("%d %b %Y"),
        "metrics": compute_metrics(node, tick),
    }
