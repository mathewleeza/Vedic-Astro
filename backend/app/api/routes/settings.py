from fastapi import APIRouter
from app.core.ephemeris.ayanamsa import AYANAMSA_OPTIONS

router = APIRouter()


@router.get("/ayanamsa")
def list_ayanamsa_options():
    return AYANAMSA_OPTIONS
