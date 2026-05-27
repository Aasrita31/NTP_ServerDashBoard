from datetime import datetime, timezone
import socket
import struct
import time
from typing import Any

from ..config import settings


def query_ntp(
    host: str,
    port: int = 123,
    timeout: float = 1.0
) -> dict[str, Any] | None:

    try:
        addr = (host, port)

        send_time = time.time()

        # NTP request packet with transmit timestamp filled in.
        msg = bytearray(48)
        msg[0] = 0x1B
        ntp_send = send_time + 2208988800
        send_seconds = int(ntp_send)
        send_fraction = int((ntp_send - send_seconds) * 0x100000000)
        struct.pack_into('!II', msg, 40, send_seconds, send_fraction)

        with socket.socket(
            socket.AF_INET,
            socket.SOCK_DGRAM
        ) as s:

            s.settimeout(timeout)

            s.sendto(msg, addr)

            data, _ = s.recvfrom(512)

        receive_time = time.time()

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

        originate_secs, originate_frac = struct.unpack(
            '!II',
            data[24:32]
        )

        receive_secs, receive_frac = struct.unpack(
            '!II',
            data[32:40]
        )

        transmit_secs, transmit_frac = struct.unpack(
            '!II',
            data[40:48]
        )

        NTP_EPOCH = 2208988800

        originate_time = (
            originate_secs - NTP_EPOCH
        ) + (originate_frac / 0x100000000)

        server_receive_time = (
            receive_secs - NTP_EPOCH
        ) + (receive_frac / 0x100000000)

        server_transmit_time = (
            transmit_secs - NTP_EPOCH
        ) + (transmit_frac / 0x100000000)

        epoch_ms = int(
            server_transmit_time * 1000
        )

        office_utc = datetime.fromtimestamp(
            server_transmit_time,
            tz=timezone.utc
        )

        system_utc = datetime.now(
            timezone.utc
        )

        delay_ms = round(
            (
                (receive_time - send_time) -
                (server_transmit_time - server_receive_time)
            ) * 1000,
            3
        )

        offset_ms = round(
            (
                (
                    server_receive_time - send_time
                ) + (
                    server_transmit_time - receive_time
                )
            ) / 2 * 1000,
            3
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

            "offset_ms": offset_ms,

            "delay_ms": delay_ms,

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

            "originate_ms": int(originate_time * 1000),

            "receive_ms": int(server_receive_time * 1000),

            "status": "SYNCHRONIZED"
        }

    except Exception:

        return None


def get_office_ntp_time():

    host = settings.office_ntp_host

    now = datetime.now(timezone.utc)
    fallback = {
        "office_utc": now.isoformat(),
        "system_utc": now.isoformat(),
        "difference_ms": 0.0,
        "offset_ms": 0.0,
        "delay_ms": 0.0,
        "epoch_ms": int(now.timestamp() * 1000),
        "stratum": None,
        "refid": None,
        "root_delay_ms": 0.0,
        "root_dispersion_ms": 0.0,
        "poll": 0,
        "precision": 0,
        "version": 0,
        "host": host or "localhost",
        "port": getattr(settings, "office_ntp_port", 123),
        "status": "FALLBACK",
        "label": settings.office_ntp_label,
    }

    if not host:
        return fallback

    port = getattr(
        settings,
        "office_ntp_port",
        123
    )

    office = query_ntp(host, port)

    if not office:
        return fallback

    office["label"] = settings.office_ntp_label

    if office.get("difference_ms") is None:
        office["difference_ms"] = 0.0
    if office.get("offset_ms") is None:
        office["offset_ms"] = 0.0
    if office.get("delay_ms") is None:
        office["delay_ms"] = 0.0
    if office.get("root_delay_ms") is None:
        office["root_delay_ms"] = 0.0
    if office.get("root_dispersion_ms") is None:
        office["root_dispersion_ms"] = 0.0

    return office