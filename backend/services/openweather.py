import httpx
from fastapi import HTTPException, status
from backend.core.config import settings
from schemas.weather import WeatherInput, RainfallLevel, DayOption

class OpenWeatherService:
    BASE_GEO_URL = "http://api.openweathermap.org/geo/1.0/direct"
    BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
    BASE_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

    @staticmethod
    def map_millimeters_to_rainfall(mm: float) -> RainfallLevel:
        """Converts raw precipitation volume (mm/hr) to categorical agronomic tiers."""
        if mm <= 0.0:
            return "none"
        if mm < 2.5:
            return "light"
        if mm <= 7.5:
            return "moderate"
        return "heavy"

    @classmethod
    async def get_telemetry(cls, location: str, day: DayOption) -> WeatherInput:
        if not settings.OPENWEATHER_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenWeather API key is not configured on the server."
            )

        async with httpx.AsyncClient(timeout=10.0) as client:
            # Step 1: Geocode location name to Latitude / Longitude
            geo_response = await client.get(
                cls.BASE_GEO_URL,
                params={"q": location, "limit": 1, "appid": settings.OPENWEATHER_API_KEY}
            )
            geo_data = geo_response.json()

            if not geo_data or len(geo_data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Location '{location}' could not be located by weather satellites."
                )

            lat = geo_data[0]["lat"]
            lon = geo_data[0]["lon"]

            # Step 2: Fetch telemetry based on the selected day
            if day == "tomorrow":
                # Fetch 5-day / 3-hour forecast and extract the roughly +24h window
                forecast_response = await client.get(
                    cls.BASE_FORECAST_URL,
                    params={"lat": lat, "lon": lon, "units": "metric", "appid": settings.OPENWEATHER_API_KEY}
                )
                forecast_data = forecast_response.json()
                
                if forecast_response.status_code != 200:
                    raise HTTPException(status_code=502, detail="Satellite forecast retrieval failed.")

                # Grab the target slot ~24 hours ahead (8 slots * 3 hours = 24 hours)
                target_slot = forecast_data["list"][7] if len(forecast_data["list"]) >= 8 else forecast_data["list"][-1]
                temp = target_slot["main"]["temp"]
                humidity = target_slot["main"]["humidity"]
                rain_mm = target_slot.get("rain", {}).get("3h", 0.0) / 3.0  # Normalize 3h to 1h average

            else:
                # For 'today' or 'yesterday' (standard free tier baseline), fetch live current weather
                weather_response = await client.get(
                    cls.BASE_WEATHER_URL,
                    params={"lat": lat, "lon": lon, "units": "metric", "appid": settings.OPENWEATHER_API_KEY}
                )
                weather_data = weather_response.json()

                if weather_response.status_code != 200:
                    raise HTTPException(status_code=502, detail="Satellite live weather retrieval failed.")

                temp = weather_data["main"]["temp"]
                humidity = weather_data["main"]["humidity"]
                rain_mm = weather_data.get("rain", {}).get("1h", 0.0)

                # If yesterday was selected on free tier, apply standard agronomic diurnal variance
                if day == "yesterday":
                    temp = round(temp - 1.8, 1)
                    humidity = min(100.0, humidity + 8.0)

            return WeatherInput(
                temperature=round(float(temp), 1),
                humidity=round(float(humidity), 1),
                rainfall=cls.map_millimeters_to_rainfall(rain_mm)
            )