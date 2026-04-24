from datetime import datetime, timezone
import pytz
from timezonefinder import TimezoneFinder


_tf = TimezoneFinder()


def resolve_timezone(lat: float, lng: float) -> str:
    """Resolve IANA timezone string from lat/lng."""
    tz = _tf.timezone_at(lat=lat, lng=lng)
    if tz is None:
        return "UTC"
    return tz


def local_to_utc(date_str: str, time_str: str, tz_str: str) -> datetime:
    """Convert local date/time string + timezone to UTC datetime."""
    local_tz = pytz.timezone(tz_str)
    naive_dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    local_dt = local_tz.localize(naive_dt)
    return local_dt.astimezone(pytz.utc)


def datetime_to_julian_day(dt_utc: datetime) -> float:
    """Convert a UTC datetime to Julian Day number."""
    import swisseph as swe
    return swe.julday(
        dt_utc.year,
        dt_utc.month,
        dt_utc.day,
        dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0,
    )
