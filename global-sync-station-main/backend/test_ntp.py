import socket
import struct
from datetime import datetime, timezone

def test_ntp(host, port, timeout):
    try:
        print(f"Testing NTP connection to {host}:{port} with timeout {timeout}s...")
        addr = (host, port)
        msg = b'\x1b' + 47 * b'\0'
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.settimeout(timeout)
            print(f"Sending NTP request...")
            s.sendto(msg, addr)
            print(f"Waiting for response...")
            data, source = s.recvfrom(512)
        print(f"Response received from {source}, {len(data)} bytes")
        return True
    except socket.timeout:
        print(f"ERROR: Socket timeout after {timeout}s")
        return False
    except socket.gaierror as e:
        print(f"ERROR: Address resolution failed - {e}")
        return False
    except ConnectionRefusedError as e:
        print(f"ERROR: Connection refused - {e}")
        return False
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")
        return False

test_ntp("10.26.13.44", 123, 5.0)
