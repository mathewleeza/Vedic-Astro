from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def root():
    return {"message": "Vedic Astro API"}
