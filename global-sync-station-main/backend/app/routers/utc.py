from datetime import datetime, timezone
import socket
import struct
import logging
from typing import Any
from fastapi import APIRouter, Body

from ..config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["utc"])

# In-memory manual override for office NTP (used for testing or manual input)
office_override: dict[str, Any] | None = None


def query_ntp(host: str, port: int = 123, timeout: float = 5.0):
    """Query an NTP server and return a dict of parsed fields or None on failure.

    Returns a dict with keys: iso, epoch_ms, stratum, refid, root_delay_ms, root_dispersion_ms, poll, precision, version
    """
    try:
        addr = (host, port)
        msg = b'\x1b' + 47 * b'\0'
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.settimeout(timeout)
            s.sendto(msg, addr)
            data, _ = s.recvfrom(512)
        if len(data) < 48:
            return None

        # First byte: LI(2) VN(3) Mode(3)
        li_vn_mode = data[0]
        version = (li_vn_mode >> 3) & 0x7

        stratum = data[1]
        poll = data[2]
        precision = struct.unpack('!b', data[3:4])[0]

        # Root Delay (signed 16.16) and Root Dispersion (unsigned 16.16)
        root_delay_raw = struct.unpack('!i', data[4:8])[0]
        root_dispersion_raw = struct.unpack('!I', data[8:12])[0]
        root_delay_s = root_delay_raw / 65536.0
        root_dispersion_s = root_dispersion_raw / 65536.0
        root_delay_ms = round(root_delay_s * 1000, 3)
        root_dispersion_ms = round(root_dispersion_s * 1000, 3)

        # Reference ID (4 bytes)
        refid_bytes = data[12:16]
        try:
            if stratum == 0 or stratum == 1:
                refid = refid_bytes.decode('ascii', errors='ignore').strip('\x00')
            else:
                refid = '.'.join(str(b) for b in refid_bytes)
        except Exception:
            refid = None

        # Transmit timestamp (bytes 40..47)
        secs, frac = struct.unpack('!II', data[40:48])
        NTP_EPOCH = 2208988800
        unix_secs = secs - NTP_EPOCH
        epoch_ms = int(unix_secs * 1000 + (frac * 1000) / 0x100000000)
        iso = datetime.fromtimestamp(unix_secs, tz=timezone.utc).isoformat()

        return {
            "iso": iso,
            "epoch_ms": epoch_ms,
            "stratum": int(stratum),
            "refid": refid,
            "root_delay_ms": root_delay_ms,
            "root_dispersion_ms": root_dispersion_ms,
            "poll": int(poll),
            "precision": int(precision),
            "version": int(version),
            "host": host,
            "port": port,
        }
    except Exception as e:
        logger.error(f"NTP query failed for {host}:{port} - {type(e).__name__}: {e}")
        return None


@router.get("/utc")
async def get_utc():
    now = datetime.now(timezone.utc)
    result = {
        "iso": now.isoformat(),
        "epoch_ms": int(now.timestamp() * 1000),
        "stratum": 1,
        "refid": ".GPS.",
        "leap": "NONE",
    }

    # If a manual override has been set (for testing), use that first
    global office_override
    if office_override:
        office = office_override.copy()
        office.setdefault("label", settings.office_ntp_label)
        office.setdefault("host", settings.office_ntp_host)
        office.setdefault("port", getattr(settings, "office_ntp_port", 123))
        result["office"] = office
    else:
        # If office NTP host configured, try to query it and include its UTC
        host = settings.office_ntp_host
        if host:
            logger.info(f"Attempting to query NTP server at {host}:{getattr(settings, 'office_ntp_port', 123)}")
            port = getattr(settings, "office_ntp_port", 123)
            office = query_ntp(host, port)
            if office:
                office["label"] = settings.office_ntp_label
                result["office"] = office
                logger.info(f"Successfully queried NTP server: {office}")
            else:
                logger.warning(f"Failed to query NTP server at {host}:{port}")
        else:
            logger.debug("No office NTP host configured")

    return result


@router.post("/office")
async def set_office_override(payload: dict = Body(...)):
    """Set a manual office UTC override for testing.

    JSON body: { "iso": "2026-05-20T06:27:45Z", "epoch_ms": 165... }
    """
    global office_override
    try:
        iso = payload.get("iso")
        epoch_ms = payload.get("epoch_ms")
        if epoch_ms is None and iso:
            # try to parse iso
            dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
            epoch_ms = int(dt.timestamp() * 1000)
        office_override = {
            "iso": iso,
            "epoch_ms": int(epoch_ms) if epoch_ms is not None else None,
            "stratum": payload.get("stratum"),
            "refid": payload.get("refid"),
            "root_delay_ms": payload.get("root_delay_ms"),
            "root_dispersion_ms": payload.get("root_dispersion_ms"),
        }
        return {"ok": True, "office": office_override}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/office")
async def get_office_override():
    """Return the current manual office override (or null)."""
    return {"office": office_override}
