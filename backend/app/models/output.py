from typing import Any, List, Optional
from pydantic import BaseModel


class PlanetPosition(BaseModel):
    id: str
    name: str
    sign: str
    sign_num: int
    degree: float
    house: int
    nakshatra: str
    pada: int
    is_retrograde: bool
    speed: float


class HouseCusp(BaseModel):
    house: int
    sign: str
    sign_num: int


class AscendantInfo(BaseModel):
    sign: str
    sign_num: int
    degree: float
    nakshatra: str
    pada: int


class ChartMeta(BaseModel):
    ayanamsa: str
    ayanamsa_value: float
    house_system: str
    julian_day: float
    utc_time: str


class D9Chart(BaseModel):
    ascendant: dict
    planets: List[PlanetPosition]


class ChartResponse(BaseModel):
    meta: ChartMeta
    ascendant: AscendantInfo
    planets: List[PlanetPosition]
    houses: List[HouseCusp]
    d9: D9Chart


class DashaEntry(BaseModel):
    planet: str
    start: str
    end: str
    antardashas: Optional[List["DashaEntry"]] = None


DashaEntry.model_rebuild()


class DashaBalanceAtBirth(BaseModel):
    planet: str
    years_remaining: float


class DashaResponse(BaseModel):
    moon_nakshatra: str
    dasha_balance_at_birth: DashaBalanceAtBirth
    mahadashas: List[DashaEntry]


class Finding(BaseModel):
    text: str
    attributed_to: List[str]


class AnalysisSection(BaseModel):
    title: str
    findings: List[Finding]


class PersonalityReport(BaseModel):
    summary: str
    sections: List[AnalysisSection]


class CurrentDasha(BaseModel):
    mahadasha: str
    antardasha: str
    start: str
    end: str
    interpretation: str


class TransitInfo(BaseModel):
    planet: str
    transiting_over: str
    interpretation: str


class TimingReport(BaseModel):
    current_dasha: CurrentDasha
    upcoming_dashas: List[Any]
    current_transits: List[TransitInfo]


class Yoga(BaseModel):
    name: str
    present: bool
    conditions_met: str
    effect: str


class AnalysisResponse(BaseModel):
    personality: PersonalityReport
    timing: TimingReport
    yogas: List[Yoga]
