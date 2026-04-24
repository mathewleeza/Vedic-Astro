from app.core.chart.d1 import longitude_to_sign, PLANET_DISPLAY_NAMES
from app.core.chart.nakshatra import get_nakshatra

# Navamsa (D9) — each sign is divided into 9 parts of 3°20' each
# The navamsa sequence starts at Aries for fire signs, Cancer for earth,
# Libra for air, and Capricorn for water.

NAVAMSA_START = {
    1: 0,   # Aries  → Aries
    2: 9,   # Taurus → Capricorn (index 9)
    3: 6,   # Gemini → Libra (index 6)
    4: 3,   # Cancer → Cancer (index 3)
    5: 0,   # Leo    → Aries
    6: 9,   # Virgo  → Capricorn
    7: 6,   # Libra  → Libra
    8: 3,   # Scorpio→ Cancer
    9: 0,   # Sagittarius → Aries
    10: 9,  # Capricorn → Capricorn
    11: 6,  # Aquarius → Libra
    12: 3,  # Pisces → Cancer
}


def get_navamsa_longitude(longitude: float) -> float:
    """Return the navamsa (D9) longitude for a given ecliptic longitude."""
    longitude = longitude % 360
    sign_num = int(longitude / 30) + 1
    degree_in_sign = longitude % 30
    navamsa_index = int(degree_in_sign / (30 / 9))
    start_sign_index = NAVAMSA_START[sign_num]
    navamsa_sign_index = (start_sign_index + navamsa_index) % 12
    degree_in_navamsa = (degree_in_sign % (30 / 9)) * 9
    return navamsa_sign_index * 30 + degree_in_navamsa


def build_d9_chart(planet_positions: dict, asc_longitude: float) -> dict:
    """Build the Navamsa (D9) chart."""
    planets = []
    for pid, data in planet_positions.items():
        nav_lon = get_navamsa_longitude(data["longitude"])
        sign_info = longitude_to_sign(nav_lon)
        nak_info = get_nakshatra(nav_lon)
        planets.append({
            "id": pid,
            "name": PLANET_DISPLAY_NAMES.get(pid, pid.capitalize()),
            "sign": sign_info["sign"],
            "sign_num": sign_info["sign_num"],
            "degree": sign_info["degree"],
            "house": 0,
            "nakshatra": nak_info["nakshatra"],
            "pada": nak_info["pada"],
            "is_retrograde": data.get("is_retrograde", False),
            "speed": round(data.get("speed", 0.0), 6),
        })

    nav_asc_lon = get_navamsa_longitude(asc_longitude)
    asc_sign = longitude_to_sign(nav_asc_lon)
    return {
        "ascendant": {"sign": asc_sign["sign"], "degree": asc_sign["degree"]},
        "planets": planets,
    }
