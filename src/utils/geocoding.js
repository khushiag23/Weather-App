// Nominatim OpenStreetMap Geocoding Service
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

// Keep track of last request time for rate limiting
let lastRequestTime = 0;

/**
 * Delay execution to respect Nominatim's usage policy (max 1 request per second)
 */
const rateLimitRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const minRequestInterval = 1000; // 1 second in milliseconds

  if (timeSinceLastRequest < minRequestInterval) {
    await new Promise(resolve => setTimeout(resolve, minRequestInterval - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
};

/**
 * Get coordinates for a city using OpenStreetMap's Nominatim service
 * @param {string} cityName - Name of the city to look up
 * @returns {Promise<{lat: number, lon: number, display_name: string}>}
 */
export const getCityCoordinates = async (cityName) => {
  await rateLimitRequest();

  const params = new URLSearchParams({
    q: cityName,
    format: 'json',
    limit: 1,
    addressdetails: 1,
  });

  const response = await fetch(`${NOMINATIM_API}?${params}`, {
    headers: {
      'User-Agent': 'WeatherApp/1.0' // Required by Nominatim's usage policy
    }
  });

  if (!response.ok) {
    throw new Error(`Geocoding error: ${response.statusText}`);
  }

  const results = await response.json();
  
  if (!results || results.length === 0) {
    throw new Error(`No results found for "${cityName}"`);
  }

  const result = results[0];
  const country = result.address?.country || '';
  const city = result.address?.city || result.address?.town || result.address?.village || cityName;
  
  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    display_name: `${city}${country ? `, ${country}` : ''}`,
  };
};

export default {
  getCityCoordinates,
};