import React from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Compass, 
  Gauge, 
  Eye, 
  Sunrise, 
  Sunset, 
  CloudRain, 
  Activity 
} from 'lucide-react';

export default function WeatherMetrics({
  weatherData,
  t,
  lang = 'en',
  windUnit
}) {
  if (!weatherData || !weatherData.weather || !weatherData.weather.current) {
    return null;
  }

  const { current, daily, hourly } = weatherData.weather;
  const aqi = weatherData.aqi?.current;

  const rawWind = current.wind_speed_10m;
  let formattedWind = Math.round(rawWind);
  let windUnitLabel = t.kmh;

  if (windUnit === 'ms') {
    formattedWind = (rawWind / 3.6).toFixed(1);
    windUnitLabel = t.ms;
  } else if (windUnit === 'mph') {
    formattedWind = Math.round(rawWind * 0.621371);
    windUnitLabel = t.mph;
  }

  const windDeg = current.wind_direction_10m || 0;
  const humidity = current.relative_humidity_2m;
  const pressure = Math.round(current.surface_pressure);
  const precipitation = current.precipitation;
  const uvMax = daily?.uv_index_max ? daily.uv_index_max[0] : 0;
  const precipProb = daily?.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const sunriseTime = daily?.sunrise ? formatTime(daily.sunrise[0]) : '--:--';
  const sunsetTime = daily?.sunset ? formatTime(daily.sunset[0]) : '--:--';

  const visibilityKm = hourly?.visibility ? Math.round(hourly.visibility[0] / 1000) : 10;

  let uvLabel = t.uvLow;
  let uvColor = 'text-[#10b981]';
  if (uvMax >= 3 && uvMax < 6) {
    uvLabel = t.uvModerate;
    uvColor = 'text-[#f59e0b]';
  } else if (uvMax >= 6 && uvMax < 8) {
    uvLabel = t.uvHigh;
    uvColor = 'text-[#f97316]';
  } else if (uvMax >= 8 && uvMax < 11) {
    uvLabel = t.uvVeryHigh;
    uvColor = 'text-[#ef4444]';
  } else if (uvMax >= 11) {
    uvLabel = t.uvExtreme;
    uvColor = 'text-[#a855f7]';
  }

  let aqiLabel = t.aqiGood;
  let aqiColor = 'text-[#10b981]';
  const euAqi = aqi?.european_aqi ?? 20;

  if (euAqi <= 20) {
    aqiLabel = t.aqiGood;
    aqiColor = 'text-[#10b981]';
  } else if (euAqi <= 40) {
    aqiLabel = t.aqiFair;
    aqiColor = 'text-[#38bdf8]';
  } else if (euAqi <= 60) {
    aqiLabel = t.aqiModerate;
    aqiColor = 'text-[#f59e0b]';
  } else if (euAqi <= 80) {
    aqiLabel = t.aqiPoor;
    aqiColor = 'text-[#f97316]';
  } else {
    aqiLabel = t.aqiVeryPoor;
    aqiColor = 'text-[#ef4444]';
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      
      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.wind}</span>
          <Wind size={18} className="text-[#38bdf8]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {formattedWind} <span className="text-xs font-medium text-[#94a3b8]">{windUnitLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#94a3b8]">
            <Compass size={14} style={{ transform: `rotate(${windDeg}deg)` }} className="text-[#2563eb] transition-transform" />
            <span>{windDeg}°</span>
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.humidity}</span>
          <Droplets size={18} className="text-[#3b82f6]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {humidity}%
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            {humidity > 70 
              ? (lang === 'az' ? 'Yüksək nəmlilik' : 'High humidity') 
              : humidity < 30 
                ? (lang === 'az' ? 'Quru hava' : 'Dry air') 
                : (lang === 'az' ? 'Optimal rütubət' : 'Optimal humidity')}
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.uvIndex}</span>
          <Sun size={18} className="text-[#f59e0b]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {uvMax.toFixed(1)}
          </div>
          <div className={`mt-2 text-xs font-bold ${uvColor}`}>
            {uvLabel}
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.airQuality}</span>
          <Activity size={18} className="text-[#10b981]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {euAqi} <span className="text-xs font-medium text-[#94a3b8]">AQI</span>
          </div>
          <div className={`mt-2 text-xs font-bold ${aqiColor}`}>
            {aqiLabel}
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.pressure}</span>
          <Gauge size={18} className="text-[#a855f7]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {pressure} <span className="text-xs font-medium text-[#94a3b8]">{t.hpa}</span>
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            {(pressure * 0.750062).toFixed(0)} mmHg
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.visibility}</span>
          <Eye size={18} className="text-[#2dd4bf]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {visibilityKm} <span className="text-xs font-medium text-[#94a3b8]">{t.km}</span>
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            {visibilityKm >= 10 
              ? (lang === 'az' ? 'Aydın görünüş' : 'Clear visibility') 
              : (lang === 'az' ? 'Məhdud görünüş' : 'Limited visibility')}
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.precipitation}</span>
          <CloudRain size={18} className="text-[#60a5fa]" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#f8fafc]">
            {precipProb}%
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            {precipitation > 0 ? `${precipitation} mm` : '0 mm'}
          </div>
        </div>
      </div>

      <div className="bg-[#161f30] border border-[#243046] rounded-2xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94a3b8] mb-2">
          <span className="text-xs font-semibold">{t.sunrise} / {t.sunset}</span>
          <Sunrise size={18} className="text-[#f59e0b]" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
            <span className="flex items-center gap-1 text-[#f59e0b]"><Sunrise size={13} /> {t.sunrise}</span>
            <span>{sunriseTime}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
            <span className="flex items-center gap-1 text-[#f97316]"><Sunset size={13} /> {t.sunset}</span>
            <span>{sunsetTime}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
