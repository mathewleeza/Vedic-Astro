from app.core.analysis.rules import get_house, get_sign, SIGN_LORDS

SUN_SIGN_TEXTS = {
    "Aries": "bold, pioneering nature with natural leadership",
    "Taurus": "steady, reliable character with a love for comfort",
    "Gemini": "curious, adaptable intellect with excellent communication",
    "Cancer": "deeply intuitive, nurturing spirit with a rich emotional world",
    "Leo": "radiant confidence, creativity, and a desire to shine",
    "Virgo": "analytical precision, attention to detail, and a drive for perfection",
    "Libra": "diplomatic grace, a love of beauty, and strong sense of fairness",
    "Scorpio": "intense depth, transformative power, and penetrating insight",
    "Sagittarius": "expansive vision, philosophical curiosity, and love of freedom",
    "Capricorn": "disciplined ambition, pragmatic outlook, and long-term vision",
    "Aquarius": "innovative thinking, humanitarian ideals, and intellectual independence",
    "Pisces": "compassionate sensitivity, spiritual depth, and creative imagination",
}

MOON_SIGN_TEXTS = {
    "Aries": "emotionally impulsive, courageous, and quick to react",
    "Taurus": "emotionally stable, comfort-seeking, and deeply attached",
    "Gemini": "mentally restless, emotionally versatile, and curious",
    "Cancer": "deeply sensitive, protective, and home-loving",
    "Leo": "warm-hearted, proud, and emotionally generous",
    "Virgo": "emotionally analytical, health-conscious, and helpful",
    "Libra": "emotionally harmonious, cooperative, and relationship-oriented",
    "Scorpio": "emotionally intense, private, and deeply perceptive",
    "Sagittarius": "emotionally adventurous, optimistic, and freedom-loving",
    "Capricorn": "emotionally restrained, dutiful, and persistent",
    "Aquarius": "emotionally detached, idealistic, and independent",
    "Pisces": "emotionally fluid, empathetic, and spiritually attuned",
}

HOUSE_TEXTS = {
    1: "the self and personality",
    2: "wealth and family",
    3: "communication and courage",
    4: "home and mother",
    5: "creativity and children",
    6: "health and enemies",
    7: "partnerships and spouse",
    8: "transformation and hidden matters",
    9: "philosophy and higher learning",
    10: "career and public life",
    11: "gains and social networks",
    12: "liberation and foreign lands",
}


def build_personality_report(planets: list, ascendant: dict) -> dict:
    sun = next((p for p in planets if p["id"] == "sun"), None)
    moon = next((p for p in planets if p["id"] == "moon"), None)
    asc_sign = ascendant.get("sign", "")

    sections = []

    # Core Identity
    core_findings = []
    if sun:
        sun_text = SUN_SIGN_TEXTS.get(sun["sign"], "")
        core_findings.append({
            "text": (
                f"Sun in {sun['sign']} in the {sun['house']}th house brings "
                f"{sun_text}, with themes of {HOUSE_TEXTS.get(sun['house'], 'life')}."
            ),
            "attributed_to": [f"Sun in {sun['sign']}", f"{sun['house']}th house", sun.get("nakshatra", "")],
        })
    if asc_sign:
        core_findings.append({
            "text": f"A {asc_sign} Ascendant gives the personality a {SUN_SIGN_TEXTS.get(asc_sign, 'distinctive')} quality.",
            "attributed_to": [f"{asc_sign} Ascendant"],
        })
    sections.append({"title": "Core Identity", "findings": core_findings})

    # Mind & Emotions
    mind_findings = []
    if moon:
        moon_text = MOON_SIGN_TEXTS.get(moon["sign"], "")
        mind_findings.append({
            "text": f"Moon in {moon['sign']} ({moon.get('nakshatra', '')} nakshatra) makes the mind {moon_text}.",
            "attributed_to": [f"Moon in {moon['sign']}", moon.get("nakshatra", "")],
        })
    sections.append({"title": "Mind & Emotions", "findings": mind_findings})

    # Career & Strengths
    career_findings = []
    saturn = next((p for p in planets if p["id"] == "saturn"), None)
    jupiter = next((p for p in planets if p["id"] == "jupiter"), None)
    if saturn:
        career_findings.append({
            "text": f"Saturn in {saturn['sign']} (house {saturn['house']}) shapes career through discipline and perseverance.",
            "attributed_to": [f"Saturn in {saturn['sign']}", f"House {saturn['house']}"],
        })
    if jupiter:
        career_findings.append({
            "text": f"Jupiter in {jupiter['sign']} (house {jupiter['house']}) expands opportunities through wisdom and teaching.",
            "attributed_to": [f"Jupiter in {jupiter['sign']}", f"House {jupiter['house']}"],
        })
    sections.append({"title": "Career & Strengths", "findings": career_findings})

    # Relationships
    rel_findings = []
    venus = next((p for p in planets if p["id"] == "venus"), None)
    if venus:
        rel_findings.append({
            "text": f"Venus in {venus['sign']} (house {venus['house']}) colours relationships with grace and a love of {venus['sign'].lower()} qualities.",
            "attributed_to": [f"Venus in {venus['sign']}", f"House {venus['house']}"],
        })
    sections.append({"title": "Relationships", "findings": rel_findings})

    summary = (
        f"Born with {asc_sign} rising"
        + (f", Sun in {sun['sign']}" if sun else "")
        + (f", and Moon in {moon['sign']}" if moon else "")
        + ", this chart reflects a unique blend of planetary energies shaping the soul's journey."
    )

    return {"summary": summary, "sections": sections}
