import React, { useState, useEffect, useCallback } from 'react';
import { fetchForecast } from './utils/openMeteo';
import { weatherCodeMap } from './utils/weatherCodes';
import { getCityCoordinates } from './utils/geocoding';
import CitySearch from './components/CitySearch';
import WeatherDisplay from './components/WeatherDisplay';


export default function App() {
  const [cityInput, setCityInput] = useState('London');
  const [currentCity, setCurrentCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (city) => {
    setIsLoading(true);
    setError(null);
    setCurrentCity(city);

    try {
      // 1. Get coordinates for the city
      const { lat, lon, display_name } = await getCityCoordinates(city);
      
      // 2. Fetch weather data using coordinates
      const data = await fetchForecast(lat, lon, { days: 7 });

      const dailyData = data.daily;
      if (!dailyData || dailyData.time.length === 0) {
        throw new Error('No daily forecast data available.');
      }

      const todayIndex = 0;
      const transformedData = {
        location: display_name,
        current: {
          temp: Math.round(dailyData.temperature_2m_max[todayIndex]),
          condition: weatherCodeMap(dailyData.weather_code[todayIndex]).condition,
          humidity: Math.round(dailyData.relative_humidity_2m_max[todayIndex]),
          wind: Math.round(dailyData.wind_speed_10m_max[todayIndex]),
        },
        forecast: dailyData.time.slice(1, 6).map((time, index) => {
          const dayIndex = index + 1;
          const date = new Date(time);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
          return {
            day: dayName,
            high: Math.round(dailyData.temperature_2m_max[dayIndex]),
            low: Math.round(dailyData.temperature_2m_min[dayIndex]),
            condition: weatherCodeMap(dailyData.weather_code[dayIndex]).condition,
          };
        }),
      };

      setWeatherData(transformedData);

    } catch (err) {
      console.error('API Fetch Error:', err);
      setError(`Could not fetch weather: ${err.message || 'Unknown error.'}`);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);



  useEffect(() => {
    fetchWeather('Tokyo');
  }, [fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(cityInput.trim());
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center p-4 sm:p-10 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'); .font-sans { font-family: 'Inter', sans-serif; }`}</style>
      <div className="w-full max-w-4xl bg-gray-800 p-6 sm:p-10 rounded-3xl shadow-2xl">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Open-Meteo Weather</h1>
          <p className="text-indigo-400">Search any city worldwide. All temperatures in Celsius (°C).</p>
        </header>

        <CitySearch cityInput={cityInput} setCityInput={setCityInput} onSearch={handleSearch} isLoading={isLoading} />

        <WeatherDisplay weatherData={weatherData} isLoading={isLoading} error={error} currentCity={currentCity} />
      </div>
    </div>
  );
}