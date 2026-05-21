from datetime import datetime, timezone
import socket
import struct
from typing import Any

from ..config import settings


def query_ntp(
    host: str,
    port: int = 123,
    timeout: float = 2.0
) -> dict[str, Any] | None:

    try:
        addr = (host, port)

        # NTP request packet
        msg = b'\x1b' + 47 * b'\0'

        with socket.socket(
            socket.AF_INET,
            socket.SOCK_DGRAM
        ) as s:

            s.settimeout(timeout)

            s.sendto(msg, addr)

            data, _ = s.recvfrom(512)

        if len(data) < 48:
            return None

        li_vn_mode = data[0]

        version = (li_vn_mode >> 3) & 0x7

        stratum = data[1]

        poll = data[2]

        precision = struct.unpack(
            '!b',
            data[3:4]
        )[0]

        root_delay_raw = struct.unpack(
            '!i',
            data[4:8]
        )[0]

        root_dispersion_raw = struct.unpack(
            '!I',
            data[8:12]
        )[0]

        root_delay_s = root_delay_raw / 65536.0

        root_dispersion_s = (
            root_dispersion_raw / 65536.0
        )

        root_delay_ms = round(
            root_delay_s * 1000,
            3
        )

        root_dispersion_ms = round(
            root_dispersion_s * 1000,
            3
        )

        refid_bytes = data[12:16]

        try:

            if stratum == 0 or stratum == 1:

                refid = refid_bytes.decode(
                    'ascii',
                    errors='ignore'
                ).strip('\x00')

            else:

                refid = '.'.join(
                    str(b) for b in refid_bytes
                )

        except Exception:

            refid = None

        secs, frac = struct.unpack(
            '!II',
            data[40:48]
        )

        NTP_EPOCH = 2208988800

        unix_secs = secs - NTP_EPOCH

        epoch_ms = int(
            unix_secs * 1000 +
            (frac * 1000) / 0x100000000
        )

        office_utc = datetime.fromtimestamp(
            unix_secs,
            tz=timezone.utc
        )

        system_utc = datetime.now(
            timezone.utc
        )

        difference_ms = round(
            (
                system_utc - office_utc
            ).total_seconds() * 1000,
            3
        )

        iso = office_utc.isoformat()

        return {

            "office_utc": iso,

            "system_utc": system_utc.isoformat(),

            "difference_ms": difference_ms,

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

            "status": "SYNCHRONIZED"
        }

    except Exception as e:

        return {
            "error": str(e)
        }


def get_office_ntp_time():

    host = settings.office_ntp_host

    if not host:

        return {
            "error": "office NTP host not configured"
        }

    port = getattr(
        settings,
        "office_ntp_port",
        123
    )

    office = query_ntp(host, port)

    if not office:

        return {
            "error": f"failed to query NTP host {host}:{port}"
        }

    office["label"] = settings.office_ntp_label

    return office