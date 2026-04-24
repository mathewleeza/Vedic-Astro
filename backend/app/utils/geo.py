from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


_geolocator = Nominatim(user_agent="vedic-astro-app/1.0")


def geocode_location(query: str) -> list:
    """Return a list of geocoding results for the query string."""
    try:
        results = _geolocator.geocode(query, exactly_one=False, limit=5, addressdetails=True)
        if not results:
            return []
        return [
            {
                "display_name": r.address,
                "latitude": r.latitude,
                "longitude": r.longitude,
            }
            for r in results
        ]
    except GeocoderTimedOut:
        return []
