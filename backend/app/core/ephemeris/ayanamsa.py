import swisseph as swe
from app.core.ephemeris.swisseph_client import AYANAMSA_MAP

AYANAMSA_OPTIONS = [
    {
        "id": "lahiri",
        "label": "Lahiri (Chitrapaksha)",
        "description": "Most widely used in India",
    },
    {
        "id": "raman",
        "label": "B.V. Raman",
        "description": "Used by B.V. Raman followers",
    },
    {
        "id": "krishnamurti",
        "label": "Krishnamurti (KP)",
        "description": "KP system astrologers",
    },
    {
        "id": "yukteshwar",
        "label": "Sri Yukteshwar",
        "description": "Based on Holy Science",
    },
    {
        "id": "fagan_bradley",
        "label": "Fagan-Bradley",
        "description": "Western sidereal",
    },
]


def get_ayanamsa_value(jd: float, ayanamsa: str) -> float:
    swe.set_sid_mode(AYANAMSA_MAP[ayanamsa])
    return swe.get_ayanamsa_ut(jd)
