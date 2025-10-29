import { Sun, CloudSun, Cloud, CloudRain, Snowflake, Zap } from 'lucide-react';

// Map WMO Weather Codes to Simplified Conditions and Lucide Icons
export const weatherCodeMap = (code) => {
  // Clear Sky
  if (code === 0) return { condition: 'Clear Sky', Icon: Sun };
  // Partly Cloudy, Mainly Clear, Overcast
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', Icon: CloudSun };
  // Fog and Depositing Rime Fog
  if (code >= 45 && code <= 48) return { condition: 'Fog / Mist', Icon: Cloud };
  // Drizzle
  if (code >= 51 && code <= 55) return { condition: 'Drizzle', Icon: CloudRain };
  // Rain
  if (code >= 61 && code <= 65) return { condition: 'Rain', Icon: CloudRain };
  // Snow
  if (code >= 71 && code <= 75) return { condition: 'Snow Fall', Icon: Snowflake };
  // Rain Showers
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', Icon: CloudRain };
  // Thunderstorm
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorms', Icon: Zap };
  
  return { condition: 'Cloudy', Icon: Cloud }; // Default
};

export default weatherCodeMap;
