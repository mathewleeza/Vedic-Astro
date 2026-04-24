# 🔱 Vedic Astro

A full-stack Vedic Astrology application with **sidereal chart calculations** powered by Swiss Ephemeris.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Web App       │     │  Mobile App     │
│  React + Vite   │     │  Expo (RN)      │
│  (TypeScript)   │     │  (TypeScript)   │
└────────┬────────┘     └────────┬────────┘
         │  HTTP (Axios)         │
         └──────────┬────────────┘
                    ▼
         ┌──────────────────────┐
         │   FastAPI Backend    │
         │   Python 3.11        │
         │   (pyswisseph)       │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │   Swiss Ephemeris    │
         │   Sidereal Calc.     │
         └──────────────────────┘
```

## Project Structure

```
vedic-astro/
├── backend/               # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/    # chart, dasha, analysis, geo, settings
│   │   ├── core/
│   │   │   ├── ephemeris/ # Swiss Ephemeris wrapper + ayanamsa
│   │   │   ├── chart/     # D1 (Rasi), D9 (Navamsa), Nakshatra
│   │   │   ├── dasha/     # Vimshottari dasha engine
│   │   │   └── analysis/  # Yogas + personality report
│   │   ├── models/        # Pydantic input/output schemas
│   │   └── utils/         # Timezone + geocoding
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── web/                   # React (Vite + TypeScript)
│   └── src/
│       ├── pages/         # Home, Chart, Dasha, Analysis
│       ├── components/    # ChartWheel, PlanetTable, DashaTimeline, AnalysisReport
│       ├── api/client.ts
│       └── store/chartStore.ts
├── mobile/                # React Native (Expo)
│   └── src/
│       ├── screens/       # HomeScreen, ChartScreen, DashaScreen, AnalysisScreen
│       └── api/client.ts
└── shared/
    └── types/             # Shared TypeScript types (chart.ts, analysis.ts)
```

---

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run tests:
```bash
cd backend
pytest tests/ -v
```

With Docker:
```bash
docker build -t vedic-astro-backend .
docker run -p 8000:8000 vedic-astro-backend
```

### Web App

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
```

### Mobile App

```bash
cd mobile
npm install
npx expo start       # Scan QR code with Expo Go
```

### Desktop App

**Prerequisites:** Node.js 18+, Python 3.11+, backend Python deps installed

Build a native installer with a single command:

```bash
bash scripts/build-desktop.sh
```

This will:
1. Build the React web app (`web/dist/`)
2. Copy the React build into `backend/static/` so FastAPI serves it
3. Bundle the Python backend into a self-contained binary via PyInstaller (`backend/dist/vedic-astro-backend/`)
4. Package everything into a native installer via Electron + electron-builder (`desktop/dist/`)

**Output by platform:**

| Platform | Installer format |
|----------|-----------------|
| Windows  | `.exe` (NSIS)   |
| macOS    | `.dmg`          |
| Linux    | `.AppImage` and `.deb` |

**Development mode** (requires backend Python deps installed and `uvicorn` running separately):

```bash
cd desktop
npm install
npm run dev
```

This compiles the TypeScript Electron shell and opens a window pointing at the FastAPI backend running at `http://localhost:8000`.

---

## API Endpoint Reference

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chart` | Calculate full sidereal D1+D9 chart |
| `POST` | `/api/dasha` | Generate Vimshottari dasha timeline |
| `POST` | `/api/analysis` | Personality + yoga + timing analysis |
| `GET`  | `/api/geo/search?q=` | Location geocoding search |
| `GET`  | `/api/settings/ayanamsa` | List available ayanamsa systems |

### Chart Request Body

```json
{
  "birth_date": "1990-07-15",
  "birth_time": "14:30",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timezone": "Asia/Kolkata",
  "ayanamsa": "lahiri",
  "house_system": "whole_sign"
}
```

---

## Ayanamsa Options

| ID | Label | Description |
|----|-------|-------------|
| `lahiri` | Lahiri (Chitrapaksha) | Most widely used in India |
| `raman` | B.V. Raman | Used by B.V. Raman followers |
| `krishnamurti` | Krishnamurti (KP) | KP system astrologers |
| `yukteshwar` | Sri Yukteshwar | Based on Holy Science |
| `fagan_bradley` | Fagan-Bradley | Western sidereal |

---

## Environment Variables

| Variable | App | Description |
|----------|-----|-------------|
| `VITE_API_URL` | Web | Backend API base URL (e.g. `http://localhost:8000`) |
| `EXPO_PUBLIC_API_URL` | Mobile | Backend API base URL |

Create a `.env` file in the `web/` or `mobile/` directory:

```env
# web/.env
VITE_API_URL=http://localhost:8000

# mobile/.env
EXPO_PUBLIC_API_URL=http://192.168.1.x:8000
```

---

## Features

- **Sidereal charts** — D1 (Rasi) and D9 (Navamsa) with all 9 grahas
- **5 ayanamsa systems** — Lahiri, Raman, KP, Yukteshwar, Fagan-Bradley
- **Nakshatra + pada** — for every planet and the ascendant
- **Vimshottari dasha** — full 120-year timeline with antardashas
- **Yoga detection** — Gajakesari, Budha-Aditya, Raj Yoga, Parivartana, and more
- **Personality analysis** — template-based report from Sun, Moon, Ascendant
- **Location search** — OpenStreetMap Nominatim geocoding (no API key needed)
- **SVG chart wheel** — interactive D3-powered chart visualization
