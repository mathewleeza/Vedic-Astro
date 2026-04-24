"""Rule engine base utilities."""

SIGN_ELEMENT = {
    "Aries": "fire", "Leo": "fire", "Sagittarius": "fire",
    "Taurus": "earth", "Virgo": "earth", "Capricorn": "earth",
    "Gemini": "air", "Libra": "air", "Aquarius": "air",
    "Cancer": "water", "Scorpio": "water", "Pisces": "water",
}

KENDRA_HOUSES = {1, 4, 7, 10}
TRIKONA_HOUSES = {1, 5, 9}
DUSTHANA_HOUSES = {6, 8, 12}

SIGN_LORDS = {
    "Aries": "mars",
    "Taurus": "venus",
    "Gemini": "mercury",
    "Cancer": "moon",
    "Leo": "sun",
    "Virgo": "mercury",
    "Libra": "venus",
    "Scorpio": "mars",
    "Sagittarius": "jupiter",
    "Capricorn": "saturn",
    "Aquarius": "saturn",
    "Pisces": "jupiter",
}


def planets_in_same_house(planets: list, p1: str, p2: str) -> bool:
    h1 = next((p["house"] for p in planets if p["id"] == p1), None)
    h2 = next((p["house"] for p in planets if p["id"] == p2), None)
    return h1 is not None and h2 is not None and h1 == h2


def get_house(planets: list, planet_id: str) -> int | None:
    for p in planets:
        if p["id"] == planet_id:
            return p["house"]
    return None


def get_sign(planets: list, planet_id: str) -> str | None:
    for p in planets:
        if p["id"] == planet_id:
            return p["sign"]
    return None
