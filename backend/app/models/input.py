from pydantic import BaseModel


class ChartRequest(BaseModel):
    birth_date: str          # "YYYY-MM-DD"
    birth_time: str          # "HH:MM"
    latitude: float
    longitude: float
    timezone: str            # "Asia/Kolkata"
    ayanamsa: str = "lahiri"
    house_system: str = "whole_sign"
