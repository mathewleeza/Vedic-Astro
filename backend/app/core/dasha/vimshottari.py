from datetime import datetime, timedelta

VIMSHOTTARI_YEARS = {
    "ketu": 7,
    "venus": 20,
    "sun": 6,
    "moon": 10,
    "mars": 7,
    "rahu": 18,
    "jupiter": 16,
    "saturn": 19,
    "mercury": 17,
}
TOTAL_YEARS = 120

NAKSHATRA_LORDS = [
    "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury",
    "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury",
    "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury",
]

NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]


def get_vimshottari_dasha(moon_longitude: float, birth_dt: datetime) -> dict:
    """Calculate full Vimshottari dasha from Moon longitude and birth datetime."""
    moon_longitude = moon_longitude % 360
    nakshatra_span = 360.0 / 27
    nakshatra_index = int(moon_longitude / nakshatra_span)
    if nakshatra_index >= 27:
        nakshatra_index = 26

    position_in_nakshatra = (moon_longitude % nakshatra_span) / nakshatra_span
    lord = NAKSHATRA_LORDS[nakshatra_index]
    years_elapsed = VIMSHOTTARI_YEARS[lord] * position_in_nakshatra
    years_remaining = VIMSHOTTARI_YEARS[lord] - years_elapsed

    lords_list = list(VIMSHOTTARI_YEARS.keys())
    start_index = lords_list.index(lord)
    sequence = lords_list[start_index:] + lords_list[:start_index]

    mahadashas = []
    current = birth_dt - timedelta(days=years_elapsed * 365.25)

    for maha_lord in sequence:
        duration_days = VIMSHOTTARI_YEARS[maha_lord] * 365.25
        maha_end = current + timedelta(days=duration_days)

        antardashas = []
        antar_start = current
        antar_index = lords_list.index(maha_lord)
        antar_sequence = lords_list[antar_index:] + lords_list[:antar_index]

        for antar_lord in antar_sequence:
            antar_days = (
                VIMSHOTTARI_YEARS[maha_lord] * VIMSHOTTARI_YEARS[antar_lord] / TOTAL_YEARS
            ) * 365.25
            antar_end = antar_start + timedelta(days=antar_days)
            antardashas.append({
                "planet": antar_lord,
                "start": antar_start.date().isoformat(),
                "end": antar_end.date().isoformat(),
            })
            antar_start = antar_end

        mahadashas.append({
            "planet": maha_lord,
            "start": current.date().isoformat(),
            "end": maha_end.date().isoformat(),
            "antardashas": antardashas,
        })
        current = maha_end

    return {
        "moon_nakshatra": NAKSHATRA_NAMES[nakshatra_index],
        "dasha_balance_at_birth": {
            "planet": lord,
            "years_remaining": round(years_remaining, 2),
        },
        "mahadashas": mahadashas,
    }
