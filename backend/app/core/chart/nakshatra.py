NAKSHATRAS = [
    {"name": "Ashwini",      "lord": "ketu",    "start_degree": 0.0},
    {"name": "Bharani",      "lord": "venus",   "start_degree": 13.333},
    {"name": "Krittika",     "lord": "sun",     "start_degree": 26.667},
    {"name": "Rohini",       "lord": "moon",    "start_degree": 40.0},
    {"name": "Mrigashira",   "lord": "mars",    "start_degree": 53.333},
    {"name": "Ardra",        "lord": "rahu",    "start_degree": 66.667},
    {"name": "Punarvasu",    "lord": "jupiter", "start_degree": 80.0},
    {"name": "Pushya",       "lord": "saturn",  "start_degree": 93.333},
    {"name": "Ashlesha",     "lord": "mercury", "start_degree": 106.667},
    {"name": "Magha",        "lord": "ketu",    "start_degree": 120.0},
    {"name": "Purva Phalguni","lord": "venus",  "start_degree": 133.333},
    {"name": "Uttara Phalguni","lord": "sun",   "start_degree": 146.667},
    {"name": "Hasta",        "lord": "moon",    "start_degree": 160.0},
    {"name": "Chitra",       "lord": "mars",    "start_degree": 173.333},
    {"name": "Swati",        "lord": "rahu",    "start_degree": 186.667},
    {"name": "Vishakha",     "lord": "jupiter", "start_degree": 200.0},
    {"name": "Anuradha",     "lord": "saturn",  "start_degree": 213.333},
    {"name": "Jyeshtha",     "lord": "mercury", "start_degree": 226.667},
    {"name": "Mula",         "lord": "ketu",    "start_degree": 240.0},
    {"name": "Purva Ashadha","lord": "venus",   "start_degree": 253.333},
    {"name": "Uttara Ashadha","lord": "sun",    "start_degree": 266.667},
    {"name": "Shravana",     "lord": "moon",    "start_degree": 280.0},
    {"name": "Dhanishtha",   "lord": "mars",    "start_degree": 293.333},
    {"name": "Shatabhisha",  "lord": "rahu",    "start_degree": 306.667},
    {"name": "Purva Bhadrapada","lord": "jupiter","start_degree": 320.0},
    {"name": "Uttara Bhadrapada","lord": "saturn","start_degree": 333.333},
    {"name": "Revati",       "lord": "mercury", "start_degree": 346.667},
]

NAKSHATRA_LORDS = [n["lord"] for n in NAKSHATRAS]

NAKSHATRA_SPAN = 360.0 / 27  # 13.333...°
PADA_SPAN = NAKSHATRA_SPAN / 4  # 3.333...°


def get_nakshatra(longitude: float) -> dict:
    """Return nakshatra name, pada (1-4), and lord for a given ecliptic longitude."""
    longitude = longitude % 360
    index = int(longitude / NAKSHATRA_SPAN)
    if index >= 27:
        index = 26
    nakshatra = NAKSHATRAS[index]
    offset = longitude - nakshatra["start_degree"]
    pada = int(offset / PADA_SPAN) + 1
    if pada > 4:
        pada = 4
    return {
        "nakshatra": nakshatra["name"],
        "pada": pada,
        "lord": nakshatra["lord"],
    }
