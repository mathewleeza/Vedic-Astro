"""Tests for Vimshottari dasha calculation."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from datetime import datetime
from app.core.dasha.vimshottari import get_vimshottari_dasha, VIMSHOTTARI_YEARS, NAKSHATRA_LORDS


# Moon in Jyeshtha nakshatra ≈ 226.67–240.0°. Use 229° (Jyeshtha, lord Mercury).
MOON_LONGITUDE_JYESHTHA = 229.0
BIRTH_DT = datetime(1990, 7, 15, 9, 0, 0)  # UTC


@pytest.fixture(scope="module")
def dasha_result():
    return get_vimshottari_dasha(MOON_LONGITUDE_JYESHTHA, BIRTH_DT)


def test_moon_nakshatra_jyeshtha(dasha_result):
    """Moon at 229° should be in Jyeshtha nakshatra."""
    assert dasha_result["moon_nakshatra"] == "Jyeshtha"


def test_dasha_balance_at_birth_planet(dasha_result):
    """Starting lord for Jyeshtha should be Mercury."""
    assert dasha_result["dasha_balance_at_birth"]["planet"] == "mercury"


def test_mahadasha_count(dasha_result):
    """There should be exactly 9 mahadashas."""
    assert len(dasha_result["mahadashas"]) == 9


def test_mahadasha_sequence(dasha_result):
    """Mahadasha sequence starting from Mercury should follow Vimshottari order."""
    expected_order = ["mercury", "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn"]
    actual_order = [m["planet"] for m in dasha_result["mahadashas"]]
    assert actual_order == expected_order, f"Got: {actual_order}"


def test_antardasha_count(dasha_result):
    """Each mahadasha should have exactly 9 antardashas."""
    for maha in dasha_result["mahadashas"]:
        assert len(maha["antardashas"]) == 9, (
            f"{maha['planet']} has {len(maha['antardashas'])} antardashas, expected 9"
        )


def test_mahadasha_dates_sequential(dasha_result):
    """Mahadasha end dates should be sequential (each starts where previous ends)."""
    mahas = dasha_result["mahadashas"]
    for i in range(1, len(mahas)):
        assert mahas[i]["start"] == mahas[i - 1]["end"], (
            f"Gap between {mahas[i-1]['planet']} and {mahas[i]['planet']}"
        )


def test_dasha_balance_years_remaining(dasha_result):
    """Years remaining should be between 0 and Mercury's full period (17 years)."""
    years = dasha_result["dasha_balance_at_birth"]["years_remaining"]
    mercury_years = VIMSHOTTARI_YEARS["mercury"]
    assert 0 <= years <= mercury_years, f"years_remaining={years} out of range"


def test_antardasha_dates_within_mahadasha(dasha_result):
    """Antardasha dates should be within their parent mahadasha."""
    for maha in dasha_result["mahadashas"]:
        for antar in maha["antardashas"]:
            assert antar["start"] >= maha["start"]
            assert antar["end"] <= maha["end"]
