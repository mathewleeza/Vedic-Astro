from app.core.chart.nakshatra import get_nakshatra

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

PLANET_DISPLAY_NAMES = {
    "sun": "Sun",
    "moon": "Moon",
    "mars": "Mars",
    "mercury": "Mercury",
    "jupiter": "Jupiter",
    "venus": "Venus",
    "saturn": "Saturn",
    "rahu": "Rahu",
    "ketu": "Ketu",
}


def longitude_to_sign(longitude: float) -> dict:
    """Convert ecliptic longitude to sign name, sign_num (1-12), and degree within sign."""
    longitude = longitude % 360
    sign_index = int(longitude / 30)
    degree = longitude - sign_index * 30
    return {
        "sign": SIGNS[sign_index],
        "sign_num": sign_index + 1,
        "degree": round(degree, 4),
    }


def _assign_house(planet_longitude: float, house_cusps: list) -> int:
    """Determine which house a planet falls in given 12 house cusps (whole-sign or other)."""
    planet_longitude = planet_longitude % 360
    for i in range(12):
        cusp_start = house_cusps[i] % 360
        cusp_end = house_cusps[(i + 1) % 12] % 360
        if cusp_start <= cusp_end:
            if cusp_start <= planet_longitude < cusp_end:
                return i + 1
        else:
            if planet_longitude >= cusp_start or planet_longitude < cusp_end:
                return i + 1
    return 1


def build_d1_chart(planet_positions: dict, ascendant_longitude: float, house_cusps: list) -> dict:
    """Build a structured D1 (Rasi) chart from raw planet positions."""
    planets = []
    for pid, data in planet_positions.items():
        lon = data["longitude"]
        sign_info = longitude_to_sign(lon)
        nak_info = get_nakshatra(lon)
        house = _assign_house(lon, house_cusps)
        planets.append({
            "id": pid,
            "name": PLANET_DISPLAY_NAMES.get(pid, pid.capitalize()),
            "sign": sign_info["sign"],
            "sign_num": sign_info["sign_num"],
            "degree": sign_info["degree"],
            "house": house,
            "nakshatra": nak_info["nakshatra"],
            "pada": nak_info["pada"],
            "is_retrograde": data.get("is_retrograde", False),
            "speed": round(data.get("speed", 0.0), 6),
        })

    asc_sign = longitude_to_sign(ascendant_longitude)
    houses = []
    for i, cusp in enumerate(house_cusps):
        s = longitude_to_sign(cusp)
        houses.append({"house": i + 1, "sign": s["sign"], "sign_num": s["sign_num"]})

    return {"planets": planets, "houses": houses, "ascendant_sign": asc_sign}
