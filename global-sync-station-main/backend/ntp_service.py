import ntplib
from datetime import datetime, timezone

def get_office_ntp_time():

    client = ntplib.NTPClient()

    response = client.request(
        "10.26.13.44",
        version=3
    )

    office_utc = datetime.fromtimestamp(
        response.tx_time,
        timezone.utc
    )

    return {
        "office_utc": office_utc.isoformat(),
        "offset": response.offset,
        "delay": response.delay,
        "epoch_ms": int(response.tx_time * 1000),
        "server": "10.26.13.44"
    }