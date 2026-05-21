# NTP-SYNC Command — FastAPI Backend

Async FastAPI service that powers the React dashboard with realistic
enterprise NTP telemetry. The frontend UI is **not** modified — this
service is consumed via REST + WebSocket from `localhost:8000`.

## Layout

```
backend/
├─ app/
│  ├─ main.py            # FastAPI app + CORS wiring
│  ├─ config.py          # Settings (pydantic-settings)
│  ├─ routers/           # REST endpoints
│  │  ├─ utc.py          # GET /api/utc
│  │  └─ nodes.py        # GET /api/nodes, /api/node/{country}
│  ├─ websocket/
│  │  └─ live.py         # WS /ws/live  (1 Hz broadcast)
│  ├─ services/
│  │  ├─ nodes_data.py   # Static country registry (mirrors UI)
│  │  └─ metrics.py      # RFC 5905 / G.8273 metric synth
│  ├─ models/ntp.py      # Pydantic schemas
│  └─ utils/seeded.py    # FNV-1a deterministic jitter
└─ requirements.txt
```

## Install

```bash
cd backend
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docs: <http://localhost:8000/docs>

## Endpoints

| Method | Path                  | Description                                |
| ------ | --------------------- | ------------------------------------------ |
| GET    | `/api/utc`            | Master UTC clock (stratum-1 reference)     |
| GET    | `/api/nodes`          | All country nodes with live metrics        |
| GET    | `/api/node/{country}` | Single node by ISO (`in`) or code (`ind`)  |
| WS     | `/ws/live`            | 1 Hz tick stream: `{ utc, nodes[] }`       |

Metric payload per node:

```json
{
  "delayMs": "142.41", "offsetMs": "+0.082", "jitterMs": "0.214",
  "pdvMs": "0.612", "driftPpm": "+0.218", "reach": "377",
  "pollS": 256, "holdover": false, "qualityLabel": "LOCKED"
}
```

Bounds enforced (matches the UI):

- **Stratum 1 offset**: ±0.01–0.5 ms
- **Stratum 2 offset**: ±0.5–3 ms
- **Regional delay**: 5–40 ms · **Intercontinental**: 80–320 ms
- Jitter wanders naturally; ~3% of ticks enter `HOLDOVER`.

## Connecting the React frontend

The current UI computes metrics client-side and does not require the
backend. To switch it to live API data without changing components, add
an env var and a tiny fetch hook:

`.env` (Vite project root):

```
VITE_API_BASE=http://localhost:8000
```

Then in any component:

```ts
const base = import.meta.env.VITE_API_BASE;
const ws = new WebSocket(`${base.replace('http', 'ws')}/ws/live`);
ws.onmessage = (e) => {
  const { utc, nodes } = JSON.parse(e.data);
  // feed `nodes` into the existing COUNTRIES state
};
```

The JSON shape of each node (`flag`, `iso`, `name`, `code`, `tz`,
`offsetLabel`, `accent`, `peer`, `refid`, `stratum`, `baseRtt`,
`baseDrift`, `poll`, plus `time`, `date`, `metrics`) is identical to the
props `CountryCard` already accepts, so no component changes are needed.

## CORS

Configured for `http://localhost:5173` and `:3000` out of the box —
edit `app/config.py` (`cors_origins`) for other origins.
