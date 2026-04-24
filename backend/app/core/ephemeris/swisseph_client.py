import swisseph as swe

AYANAMSA_MAP = {
    "lahiri": swe.SIDM_LAHIRI,
    "raman": swe.SIDM_RAMAN,
    "krishnamurti": swe.SIDM_KRISHNAMURTI,
    "yukteshwar": swe.SIDM_YUKTESHWAR,
    "fagan_bradley": swe.SIDM_FAGAN_BRADLEY,
}

PLANETS = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mars": swe.MARS,
    "mercury": swe.MERCURY,
    "jupiter": swe.JUPITER,
    "venus": swe.VENUS,
    "saturn": swe.SATURN,
    "rahu": swe.MEAN_NODE,
}

HOUSE_SYSTEM_MAP = {
    "whole_sign": b"W",
    "placidus": b"P",
    "koch": b"K",
    "equal": b"E",
}


def get_planet_positions(jd: float, ayanamsa: str) -> dict:
    swe.set_sid_mode(AYANAMSA_MAP[ayanamsa])
    results = {}
    flags = swe.FLG_SIDEREAL | swe.FLG_SPEED
    for name, pid in PLANETS.items():
        pos, _ = swe.calc_ut(jd, pid, flags)
        results[name] = {
            "longitude": pos[0],
            "speed": pos[3],
            "is_retrograde": pos[3] < 0,
        }
    results["ketu"] = {
        "longitude": (results["rahu"]["longitude"] + 180) % 360,
        "speed": results["rahu"]["speed"],
        "is_retrograde": True,
    }
    return results


def get_ascendant(jd: float, lat: float, lng: float, ayanamsa: str, house_system: str = "whole_sign") -> float:
    swe.set_sid_mode(AYANAMSA_MAP[ayanamsa])
    flags = swe.FLG_SIDEREAL
    hsys = HOUSE_SYSTEM_MAP.get(house_system, b"W")
    cusps, ascmc = swe.houses_ex(jd, lat, lng, hsys, flags)
    return ascmc[0]


def get_house_cusps(jd: float, lat: float, lng: float, ayanamsa: str, house_system: str = "whole_sign") -> list:
    swe.set_sid_mode(AYANAMSA_MAP[ayanamsa])
    flags = swe.FLG_SIDEREAL
    hsys = HOUSE_SYSTEM_MAP.get(house_system, b"W")
    cusps, ascmc = swe.houses_ex(jd, lat, lng, hsys, flags)
    return list(cusps[:12])
