import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api.routes import chart, dasha, analysis
from app.api.routes.geo import router as geo_router
from app.api.routes.settings import router as settings_router

app = FastAPI(title="Vedic Astro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chart.router, prefix="/api/chart", tags=["chart"])
app.include_router(dasha.router, prefix="/api/dasha", tags=["dasha"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(geo_router, prefix="/api/geo", tags=["geo"])
app.include_router(settings_router, prefix="/api/settings", tags=["settings"])


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


def _get_static_dir() -> str:
    """Return the path to the bundled React static files."""
    if hasattr(sys, "_MEIPASS"):
        # PyInstaller bundle: all data files are extracted to sys._MEIPASS
        return os.path.join(sys._MEIPASS, "static")  # type: ignore[attr-defined]
    # Normal execution: static/ lives next to the backend/ package root
    return os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static"
    )


_STATIC_DIR = _get_static_dir()

if os.path.isdir(_STATIC_DIR):
    # Serve hashed asset bundles
    _assets_dir = os.path.join(_STATIC_DIR, "assets")
    if os.path.isdir(_assets_dir):
        app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")

    @app.get("/")
    def index() -> FileResponse:
        return FileResponse(os.path.join(_STATIC_DIR, "index.html"))

    @app.get("/{_full_path:path}")
    def spa_fallback(_full_path: str) -> FileResponse:
        """Return index.html for all non-API paths (SPA client-side routing).

        API routes (prefixed with /api/) are registered before this catch-all
        and will always take precedence. New backend routes must use the /api/
        prefix to avoid being swallowed by this handler.
        """
        return FileResponse(os.path.join(_STATIC_DIR, "index.html"))

else:
    @app.get("/")
    def root() -> dict:
        return {"message": "Vedic Astro API"}
