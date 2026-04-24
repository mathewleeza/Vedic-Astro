from fastapi import APIRouter
from app.models.input import ChartRequest
from app.models.output import ChartResponse, ChartMeta, AscendantInfo, PlanetPosition, HouseCusp, D9Chart
from app.core.ephemeris.swisseph_client import get_planet_positions, get_ascendant, get_house_cusps
from app.core.ephemeris.ayanamsa import get_ayanamsa_value
from app.core.chart.d1 import build_d1_chart, longitude_to_sign
from app.core.chart.d9 import build_d9_chart
from app.core.chart.nakshatra import get_nakshatra
from app.utils.timezone import local_to_utc, datetime_to_julian_day

router = APIRouter()


@router.post("", response_model=ChartResponse)
def calculate_chart(req: ChartRequest):
    utc_dt = local_to_utc(req.birth_date, req.birth_time, req.timezone)
    jd = datetime_to_julian_day(utc_dt)

    planet_positions = get_planet_positions(jd, req.ayanamsa)
    ascendant_lon = get_ascendant(jd, req.latitude, req.longitude, req.ayanamsa, req.house_system)
    house_cusps = get_house_cusps(jd, req.latitude, req.longitude, req.ayanamsa, req.house_system)
    ayanamsa_value = get_ayanamsa_value(jd, req.ayanamsa)

    d1 = build_d1_chart(planet_positions, ascendant_lon, house_cusps)
    d9 = build_d9_chart(planet_positions, ascendant_lon)

    asc_sign = longitude_to_sign(ascendant_lon)
    asc_nak = get_nakshatra(ascendant_lon)

    planets_out = [PlanetPosition(**p) for p in d1["planets"]]
    houses_out = [HouseCusp(**h) for h in d1["houses"]]
    d9_planets = [PlanetPosition(**p) for p in d9["planets"]]

    return ChartResponse(
        meta=ChartMeta(
            ayanamsa=req.ayanamsa,
            ayanamsa_value=round(ayanamsa_value, 4),
            house_system=req.house_system,
            julian_day=round(jd, 6),
            utc_time=utc_dt.isoformat(),
        ),
        ascendant=AscendantInfo(
            sign=asc_sign["sign"],
            sign_num=asc_sign["sign_num"],
            degree=asc_sign["degree"],
            nakshatra=asc_nak["nakshatra"],
            pada=asc_nak["pada"],
        ),
        planets=planets_out,
        houses=houses_out,
        d9=D9Chart(ascendant=d9["ascendant"], planets=d9_planets),
    )
