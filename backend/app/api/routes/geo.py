from fastapi import APIRouter, Query
from app.utils.geo import geocode_location

router = APIRouter()


@router.get("/search")
def search_location(q: str = Query(..., description="Location search query")):
    results = geocode_location(q)
    return results
