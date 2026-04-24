"""Tests for chart calculation using a known birth data."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app.core.ephemeris.swisseph_client import get_planet_positions, get_ascendant, get_house_cusps
from app.utils.timezone import local_to_utc, datetime_to_julian_day
from app.core.chart.d1 import longitude_to_sign, build_d1_chart


# Known chart: July 15 1990, 14:30 IST, New Delhi (28.6139N, 77.2090E)
BIRTH_DATE = "1990-07-15"
BIRTH_TIME = "14:30"
LATITUDE = 28.6139
LONGITUDE = 77.2090
TIMEZONE = "Asia/Kolkata"
AYANAMSA = "lahiri"
HOUSE_SYSTEM = "whole_sign"


@pytest.fixture(scope="module")
def chart_data():
    utc_dt = local_to_utc(BIRTH_DATE, BIRTH_TIME, TIMEZONE)
    jd = datetime_to_julian_day(utc_dt)
    planets = get_planet_positions(jd, AYANAMSA)
    ascendant = get_ascendant(jd, LATITUDE, LONGITUDE, AYANAMSA, HOUSE_SYSTEM)
    house_cusps = get_house_cusps(jd, LATITUDE, LONGITUDE, AYANAMSA, HOUSE_SYSTEM)
    return {"planets": planets, "ascendant": ascendant, "house_cusps": house_cusps, "jd": jd}


def test_sun_in_gemini(chart_data):
    """Sun should be in Gemini for July 15 1990 with Lahiri ayanamsa (sidereal ~88.9°)."""
    sun_lon = chart_data["planets"]["sun"]["longitude"]
    sign_info = longitude_to_sign(sun_lon)
    assert sign_info["sign"] == "Gemini", f"Expected Gemini, got {sign_info['sign']}"


def test_all_planets_present(chart_data):
    """All 9 planets (including Rahu and Ketu) should be present."""
    expected = {"sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"}
    assert expected.issubset(set(chart_data["planets"].keys()))


def test_planets_have_valid_longitudes(chart_data):
    """All planet longitudes should be between 0 and 360."""
    for name, data in chart_data["planets"].items():
        assert 0 <= data["longitude"] < 360, f"{name} longitude out of range: {data['longitude']}"


def test_ascendant_is_valid(chart_data):
    """Ascendant should be a valid longitude between 0 and 360."""
    asc = chart_data["ascendant"]
    assert 0 <= asc < 360, f"Ascendant out of range: {asc}"


def test_ascendant_sign(chart_data):
    """Verify ascendant sign can be determined."""
    asc = chart_data["ascendant"]
    sign_info = longitude_to_sign(asc)
    assert sign_info["sign"] in [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]


def test_d1_chart_structure(chart_data):
    """D1 chart should have 9 planets and 12 houses."""
    d1 = build_d1_chart(
        chart_data["planets"],
        chart_data["ascendant"],
        chart_data["house_cusps"],
    )
    assert len(d1["planets"]) == 9
    assert len(d1["houses"]) == 12


def test_ketu_opposite_rahu(chart_data):
    """Ketu should be exactly 180° from Rahu."""
    rahu_lon = chart_data["planets"]["rahu"]["longitude"]
    ketu_lon = chart_data["planets"]["ketu"]["longitude"]
    diff = abs(rahu_lon - ketu_lon)
    assert abs(diff - 180) < 0.01, f"Ketu not opposite Rahu: diff={diff}"
