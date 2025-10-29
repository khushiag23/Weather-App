// Utility functions for calling the Open-Meteo API
const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Executes a fetch request with exponential backoff for resilience.
 */
export const fetchWithBackoff = async (url, options = {}, maxRetries = 5) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
};

/**
 * Fetch the forecast data from Open-Meteo for given coordinates.
 * Returns the parsed JSON response from Open-Meteo.
 */
export const fetchForecast = async (lat, lon, options = {}) => {
  const {
    days = 7,
    timezone = 'auto',
    temperature_unit = 'celsius',
  } = options;

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,relative_humidity_2m_max',
    timezone,
    forecast_days: days,
    temperature_unit,
  });

  const apiUrl = `${API_BASE_URL}?${params.toString()}`;
  return await fetchWithBackoff(apiUrl);
};

export default {
  fetchWithBackoff,
  fetchForecast,
};
