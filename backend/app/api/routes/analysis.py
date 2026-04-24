from datetime import date
from fastapi import APIRouter
from app.models.input import ChartRequest
from app.models.output import (
    AnalysisResponse, PersonalityReport, AnalysisSection,
    Finding, TimingReport, CurrentDasha, TransitInfo, Yoga,
)
from app.core.ephemeris.swisseph_client import get_planet_positions, get_ascendant, get_house_cusps
from app.core.chart.d1 import build_d1_chart, longitude_to_sign
from app.core.chart.nakshatra import get_nakshatra
from app.core.dasha.vimshottari import get_vimshottari_dasha
from app.core.analysis.yogas import detect_yogas
from app.core.analysis.personality import build_personality_report
from app.utils.timezone import local_to_utc, datetime_to_julian_day

router = APIRouter()


@router.post("", response_model=AnalysisResponse)
def get_analysis(req: ChartRequest):
    utc_dt = local_to_utc(req.birth_date, req.birth_time, req.timezone)
    jd = datetime_to_julian_day(utc_dt)

    planet_positions = get_planet_positions(jd, req.ayanamsa)
    ascendant_lon = get_ascendant(jd, req.latitude, req.longitude, req.ayanamsa, req.house_system)
    house_cusps = get_house_cusps(jd, req.latitude, req.longitude, req.ayanamsa, req.house_system)

    d1 = build_d1_chart(planet_positions, ascendant_lon, house_cusps)
    planets = d1["planets"]
    houses = d1["houses"]

    asc_sign = longitude_to_sign(ascendant_lon)
    asc_nak = get_nakshatra(ascendant_lon)
    ascendant = {
        "sign": asc_sign["sign"],
        "sign_num": asc_sign["sign_num"],
        "degree": asc_sign["degree"],
        "nakshatra": asc_nak["nakshatra"],
        "pada": asc_nak["pada"],
    }

    # Personality
    personality_raw = build_personality_report(planets, ascendant)
    sections = [
        AnalysisSection(
            title=s["title"],
            findings=[Finding(**f) for f in s["findings"]],
        )
        for s in personality_raw["sections"]
    ]
    personality = PersonalityReport(summary=personality_raw["summary"], sections=sections)

    # Yogas
    yogas_raw = detect_yogas(planets, houses)
    yogas = [Yoga(**y) for y in yogas_raw]

    # Dasha timing
    moon_longitude = planet_positions["moon"]["longitude"]
    dasha_result = get_vimshottari_dasha(moon_longitude, utc_dt)
    today = date.today().isoformat()

    current_dasha_data = None
    upcoming = []
    for maha in dasha_result["mahadashas"]:
        if maha["start"] <= today <= maha["end"]:
            for antar in maha.get("antardashas", []):
                if antar["start"] <= today <= antar["end"]:
                    current_dasha_data = CurrentDasha(
                        mahadasha=maha["planet"].capitalize(),
                        antardasha=antar["planet"].capitalize(),
                        start=antar["start"],
                        end=antar["end"],
                        interpretation=(
                            f"{maha['planet'].capitalize()}-{antar['planet'].capitalize()} period "
                            "brings themes of growth and karmic unfolding."
                        ),
                    )
                    break
        elif maha["start"] > today and len(upcoming) < 2:
            upcoming.append({"planet": maha["planet"], "start": maha["start"], "end": maha["end"]})

    if current_dasha_data is None:
        current_dasha_data = CurrentDasha(
            mahadasha="", antardasha="", start="", end="",
            interpretation="Current dasha period could not be determined.",
        )

    timing = TimingReport(
        current_dasha=current_dasha_data,
        upcoming_dashas=upcoming,
        current_transits=[],
    )

    return AnalysisResponse(personality=personality, timing=timing, yogas=yogas)
