import React from 'react';
import { Sun, Moon, ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherCondition } from '../lib/weatherCodes';

export default function CurrentWeather({
  location,
  weatherData,
  t,
  lang,
  tempUnit
}) {
  if (!weatherData || !weatherData.weather || !weatherData.weather.current) {
    return null;
  }

  const { current, daily } = weatherData.weather;
  const isDay = current.is_day === 1;
  const code = current.weather_code;
  const condition = getWeatherCondition(code, lang);

  const convertTemp = (tempC) => {
    if (tempUnit === 'f') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const currentTemp = convertTemp(current.temperature_2m);
  const feelsLike = convertTemp(current.apparent_temperature);
  const highTemp = daily?.temperature_2m_max ? convertTemp(daily.temperature_2m_max[0]) : null;
  const lowTemp = daily?.temperature_2m_min ? convertTemp(daily.temperature_2m_min[0]) : null;
  const unitSymbol = tempUnit === 'f' ? '°F' : '°C';

  const today = new Date();
  const dayName = t.days ? t.days[today.getDay()] : '';
  const dateFormatted = today.toLocaleDateString(lang === 'az' ? 'az-AZ' : lang, {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="w-full bg-[#161f30] border border-[#243046] rounded-2xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#111827] border border-[#243046] text-[#94a3b8]">
              <MapPin size={13} className="text-[#2563eb]" />
              <span className="text-[#f8fafc] font-bold">{location.name}</span>
              {location.country ? <span>• {location.country}</span> : null}
            </span>

            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
              isDay 
                ? 'bg-[#854d0e]/20 text-[#fbbf24] border-[#ca8a04]/40' 
                : 'bg-[#1e1b4b]/40 text-[#93c5fd] border-[#3b82f6]/40'
            }`}>
              {isDay ? <Sun size={13} /> : <Moon size={13} />}
              <span>{isDay ? t.day : t.night}</span>
            </span>

            <span className="text-xs text-[#64748b] font-medium">
              {dayName}, {dateFormatted}
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-[#f8fafc]">
              {currentTemp}
              <span className="text-3xl md:text-4xl text-[#94a3b8] font-normal ml-1">
                {unitSymbol}
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl font-semibold text-[#38bdf8]">
            {condition}
          </p>

          <div className="flex items-center gap-4 text-xs md:text-sm text-[#94a3b8] pt-1">
            <span>
              {t.feelsLike}: <strong className="text-[#f8fafc]">{feelsLike}{unitSymbol}</strong>
            </span>
            {highTemp !== null && lowTemp !== null && (
              <span className="flex items-center gap-2">
                <span className="flex items-center text-[#ef4444]">
                  <ArrowUp size={14} />
                  <strong>{highTemp}°</strong>
                </span>
                <span className="flex items-center text-[#3b82f6]">
                  <ArrowDown size={14} />
                  <strong>{lowTemp}°</strong>
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-[#111827] border border-[#243046] rounded-2xl min-w-[160px] self-start md:self-center">
          <WeatherIcon code={code} isDay={isDay ? 1 : 0} size={72} />
          <span className="mt-3 text-xs font-medium text-[#94a3b8] tracking-wider uppercase">
            {isDay ? t.day : t.night}
          </span>
        </div>

      </div>
    </div>
  );
}
