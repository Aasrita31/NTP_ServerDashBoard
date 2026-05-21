import socket
import struct
from datetime import datetime, timezone

def query_ntp(host, port=123, timeout=5.0):
    """Query an NTP server and return parsed data"""
    try:
        print(f"\nQuerying NTP server at {host}:{port}...")
        addr = (host, port)
        msg = b'\x1b' + 47 * b'\0'
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.settimeout(timeout)
            s.sendto(msg, addr)
            data, _ = s.recvfrom(512)
        
        print(f"Received {len(data)} bytes")
        
        if len(data) < 48:
            print(f"ERROR: Response too short ({len(data)} < 48)")
            return None
        
        # Parse response
        li_vn_mode = data[0]
        version = (li_vn_mode >> 3) & 0x7
        stratum = data[1]
        poll = data[2]
        precision = struct.unpack('!b', data[3:4])[0]
        
        root_delay_raw = struct.unpack('!i', data[4:8])[0]
        root_dispersion_raw = struct.unpack('!I', data[8:12])[0]
        
        refid_bytes = data[12:16]
        if stratum == 0 or stratum == 1:
            refid = refid_bytes.decode('ascii', errors='ignore').strip('\x00')
        else:
            refid = '.'.join(str(b) for b in refid_bytes)
        
        secs, frac = struct.unpack('!II', data[40:48])
        NTP_EPOCH = 2208988800
        unix_secs = secs - NTP_EPOCH
        epoch_ms = int(unix_secs * 1000 + (frac * 1000) / 0x100000000)
        iso = datetime.fromtimestamp(unix_secs, tz=timezone.utc).isoformat()
        
        result = {
            "iso": iso,
            "epoch_ms": epoch_ms,
            "stratum": stratum,
            "refid": refid,
            "version": version,
            "poll": poll,
            "precision": precision,
        }
        print(f"SUCCESS: {result}")
        return result
        
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return None

# Test it
result = query_ntp("10.26.13.44", 123, 5.0)
if result:
    print(f"\nParsed NTP data: {result}")
else:
    print(f"\nFailed to parse NTP data")
