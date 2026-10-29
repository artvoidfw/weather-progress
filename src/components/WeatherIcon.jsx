import React from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog 
} from 'lucide-react';
import { getWeatherIconType } from '../lib/weatherCodes';

export default function WeatherIcon({ code = 0, isDay = 1, size = 32, className = "" }) {
  const type = getWeatherIconType(code, isDay);

  switch (type) {
    case 'sun':
      return <Sun size={size} className={`text-[#eab308] ${className}`} />;
    case 'moon':
      return <Moon size={size} className={`text-[#93c5fd] ${className}`} />;
    case 'cloud-sun':
      return <CloudSun size={size} className={`text-[#f59e0b] ${className}`} />;
    case 'cloud-moon':
      return <CloudMoon size={size} className={`text-[#818cf8] ${className}`} />;
    case 'cloud':
      return <Cloud size={size} className={`text-[#94a3b8] ${className}`} />;
    case 'fog':
      return <CloudFog size={size} className={`text-[#64748b] ${className}`} />;
    case 'rain-light':
      return <CloudDrizzle size={size} className={`text-[#38bdf8] ${className}`} />;
    case 'rain-heavy':
      return <CloudRain size={size} className={`text-[#2563eb] ${className}`} />;
    case 'snow':
      return <Snowflake size={size} className={`text-[#a5f3fc] ${className}`} />;
    case 'thunder':
      return <CloudLightning size={size} className={`text-[#fbbf24] ${className}`} />;
    default:
      return isDay ? <Sun size={size} className={`text-[#eab308] ${className}`} /> : <Moon size={size} className={`text-[#93c5fd] ${className}`} />;
  }
}
