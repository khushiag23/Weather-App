import React from 'react';
import { MapPin, Droplet, Wind, CheckCircle, AlertTriangle } from 'lucide-react';
import weatherCodeMap from '../utils/weatherCodes';

const WeatherIcon = ({ condition, size = 32, className = '' }) => {
  const mapEntry = Object.keys(weatherCodeMap).find(key => false); // placeholder - we will map by condition below
  // Find the icon by matching condition string
  const { Icon } = weatherCodeMap(condition) || {};
  if (!Icon) return null;
  return <Icon size={size} className={`text-white ${className}`} />;
};

const ForecastItem = ({ day, high, low, condition }) => {
  const { Icon } = weatherCodeMap(condition) || {};
  return (
    <div className="flex flex-col items-center p-3 sm:p-4 bg-gray-700/50 rounded-xl transition-all hover:bg-indigo-600/70 hover:shadow-lg">
      <p className="text-xs font-semibold uppercase text-indigo-300 mb-2">{day}</p>
      {Icon && <Icon size={20} className="text-indigo-200" />}
      <div className="mt-2 text-sm text-center">
        <p className="font-bold text-white">{high}°C</p>
        <p className="text-gray-400">{low}°C</p>
      </div>
    </div>
  );
};

export default function WeatherDisplay({ weatherData, isLoading, error, currentCity }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-indigo-400">
        <p className="text-lg">Fetching real weather for {currentCity}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-red-400 bg-red-900/30 p-6 rounded-xl">
        <AlertTriangle className="mb-4" size={48} />
        <p className="text-xl font-bold mb-2">Error</p>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, forecast, location } = weatherData;
  const mainIcon = weatherCodeMap(current.condition).Icon;

  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="flex items-center text-white mb-2">
            <MapPin size={24} className="mr-2" />
            <h2 className="text-3xl sm:text-4xl font-bold">{location}</h2>
          </div>
          <p className="text-indigo-200 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} (Today's Max)</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            {mainIcon && <mainIcon size={80} className="text-white" />}
            <div>
              <p className="text-7xl font-light text-white">{current.temp}°</p>
              <p className="text-xl font-medium text-indigo-200">{current.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-white pt-4 border-t-2 border-indigo-500/50 sm:border-t-0 sm:pt-0 sm:border-l-2 sm:pl-8">
            <div className='col-span-1'>
              <Droplet size={20} className="mx-auto text-indigo-300" />
              <p className="text-lg font-bold mt-1">{current.humidity}%</p>
              <p className="text-xs text-indigo-200">Max Humidity</p>
            </div>
            <div className='col-span-1'>
              <Wind size={20} className="mx-auto text-indigo-300" />
              <p className="text-lg font-bold mt-1">{current.wind} km/h</p>
              <p className="text-xs text-indigo-200">Max Wind</p>
            </div>
            <div className='col-span-1'>
              <CheckCircle size={20} className="mx-auto text-indigo-300" />
              <p className="text-lg font-bold mt-1">N/A</p>
              <p className="text-xs text-indigo-200">Air Quality</p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Next 5 Days Forecast</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {forecast?.map((dayData, index) => (
            <ForecastItem key={index} {...dayData} />
          ))}
        </div>
      </section>
    </div>
  );
}
