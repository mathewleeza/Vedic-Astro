from app.core.analysis.rules import (
    KENDRA_HOUSES, TRIKONA_HOUSES, SIGN_LORDS,
    planets_in_same_house, get_house, get_sign,
)


def detect_yogas(planets: list, houses: list) -> list:
    yogas = []

    # --- Gajakesari Yoga ---
    moon_house = get_house(planets, "moon")
    jupiter_house = get_house(planets, "jupiter")
    gajakesari = False
    if moon_house and jupiter_house:
        diff = abs(jupiter_house - moon_house)
        if diff in (0, 3, 6, 9):
            gajakesari = True
    yogas.append({
        "name": "Gajakesari Yoga",
        "present": gajakesari,
        "conditions_met": "Jupiter in Kendra from Moon" if gajakesari else "Condition not met",
        "effect": "Wisdom, reputation, and good fortune are indicated." if gajakesari else "",
    })

    # --- Budha-Aditya Yoga ---
    budha_aditya = planets_in_same_house(planets, "sun", "mercury")
    yogas.append({
        "name": "Budha-Aditya Yoga",
        "present": budha_aditya,
        "conditions_met": "Sun and Mercury conjunct" if budha_aditya else "Condition not met",
        "effect": "Intelligence, eloquence, and professional success." if budha_aditya else "",
    })

    # --- Chandra-Mangala Yoga ---
    chandra_mangala = planets_in_same_house(planets, "moon", "mars")
    yogas.append({
        "name": "Chandra-Mangala Yoga",
        "present": chandra_mangala,
        "conditions_met": "Moon and Mars conjunct" if chandra_mangala else "Condition not met",
        "effect": "Financial acumen and assertive mind." if chandra_mangala else "",
    })

    # --- Kemadruma Yoga (negative) ---
    moon_house = get_house(planets, "moon")
    kemadruma = True
    if moon_house is not None:
        adjacent = {(moon_house - 2) % 12 + 1, moon_house % 12 + 1}
        for p in planets:
            if p["id"] not in ("moon", "rahu", "ketu") and p["house"] in adjacent:
                kemadruma = False
                break
    yogas.append({
        "name": "Kemadruma Yoga",
        "present": kemadruma,
        "conditions_met": "No planets in 2nd or 12th from Moon" if kemadruma else "Planets adjacent to Moon",
        "effect": "Challenges in mental peace and stability." if kemadruma else "",
    })

    # --- Parivartana Yoga ---
    parivartana = False
    parivartana_desc = ""
    planet_sign_map = {p["id"]: p["sign"] for p in planets}
    for p1 in planets:
        for p2 in planets:
            if p1["id"] >= p2["id"]:
                continue
            if SIGN_LORDS.get(p1["sign"]) == p2["id"] and SIGN_LORDS.get(p2["sign"]) == p1["id"]:
                parivartana = True
                parivartana_desc = f"{p1['name']} and {p2['name']} in mutual sign exchange"
    yogas.append({
        "name": "Parivartana Yoga",
        "present": parivartana,
        "conditions_met": parivartana_desc if parivartana else "No mutual sign exchange found",
        "effect": "Mutual strengthening of the exchanging planets." if parivartana else "",
    })

    # --- Raj Yoga ---
    raj_yoga = False
    kendra_lords = set()
    trikona_lords = set()
    for house in houses:
        lord = SIGN_LORDS.get(house["sign"])
        if house["house"] in KENDRA_HOUSES:
            kendra_lords.add(lord)
        if house["house"] in TRIKONA_HOUSES:
            trikona_lords.add(lord)
    common = kendra_lords & trikona_lords
    if common:
        raj_yoga = True
    yogas.append({
        "name": "Raj Yoga",
        "present": raj_yoga,
        "conditions_met": "Kendra and Trikona lords combined" if raj_yoga else "Condition not met",
        "effect": "Authority, success, and recognition in society." if raj_yoga else "",
    })

    return yogas
