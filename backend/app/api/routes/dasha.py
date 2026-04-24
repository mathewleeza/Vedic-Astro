from fastapi import APIRouter
from app.models.input import ChartRequest
from app.models.output import DashaResponse, DashaEntry, DashaBalanceAtBirth
from app.core.ephemeris.swisseph_client import get_planet_positions
from app.core.dasha.vimshottari import get_vimshottari_dasha
from app.utils.timezone import local_to_utc, datetime_to_julian_day

router = APIRouter()


@router.post("", response_model=DashaResponse)
def calculate_dasha(req: ChartRequest):
    utc_dt = local_to_utc(req.birth_date, req.birth_time, req.timezone)
    jd = datetime_to_julian_day(utc_dt)

    planet_positions = get_planet_positions(jd, req.ayanamsa)
    moon_longitude = planet_positions["moon"]["longitude"]

    result = get_vimshottari_dasha(moon_longitude, utc_dt)

    mahadashas = [
        DashaEntry(
            planet=m["planet"],
            start=m["start"],
            end=m["end"],
            antardashas=[
                DashaEntry(planet=a["planet"], start=a["start"], end=a["end"])
                for a in m.get("antardashas", [])
            ],
        )
        for m in result["mahadashas"]
    ]

    return DashaResponse(
        moon_nakshatra=result["moon_nakshatra"],
        dasha_balance_at_birth=DashaBalanceAtBirth(**result["dasha_balance_at_birth"]),
        mahadashas=mahadashas,
    )
