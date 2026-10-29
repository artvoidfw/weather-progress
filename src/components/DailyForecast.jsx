import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherCondition } from '../lib/weatherCodes';

export default function DailyForecast({
  weatherData,
  t,
  lang,
  tempUnit
}) {
  if (!weatherData || !weatherData.weather || !weatherData.weather.daily) {
    return null;
  }

  const { daily } = weatherData.weather;
  const dates = daily.time || [];
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];
  const codes = daily.weather_code || [];
  const precipProbs = daily.precipitation_probability_max || [];

  const convertTemp = (tempC) => {
    if (tempUnit === 'f') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const daysList = dates.slice(0, 7).map((dateStr, idx) => {
    const d = new Date(dateStr);
    const isToday = idx === 0;
    const dayName = isToday ? t.today : (t.days ? t.days[d.getDay()] : dateStr);
    const condition = getWeatherCondition(codes[idx], lang);
    const maxT = convertTemp(maxTemps[idx]);
    const minT = convertTemp(minTemps[idx]);
    const precip = precipProbs[idx] ?? 0;

    return {
      date: dateStr,
      dayName,
      code: codes[idx] ?? 0,
      condition,
      maxT,
      minT,
      precip,
      isToday
    };
  });

  return (
    <div className="w-full bg-[#161f30] border border-[#243046] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
          <Calendar size={18} className="text-[#2563eb]" />
          <span>{t.dailyForecast}</span>
        </h2>
      </div>

      <div className="space-y-2.5">
        {daysList.map((day, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
              day.isToday 
                ? 'bg-[#1e293b] border-[#3b82f6]' 
                : 'bg-[#111827] border-[#243046] hover:bg-[#1e293b]/60'
            }`}
          >
            <div className="w-28 md:w-36">
              <span className={`text-sm font-bold block ${day.isToday ? 'text-[#38bdf8]' : 'text-[#f8fafc]'}`}>
                {day.dayName}
              </span>
              <span className="text-xs text-[#94a3b8] truncate block">
                {day.condition}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <WeatherIcon code={day.code} isDay={1} size={24} />
              {day.precip > 0 && (
                <div className="flex items-center text-[11px] font-semibold text-[#38bdf8] gap-0.5">
                  <Droplets size={12} />
                  <span>{day.precip}%</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="text-[#3b82f6] w-8 text-right">{day.minT}°</span>
              <div className="w-20 md:w-32 h-1.5 bg-[#243046] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563eb] rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(15, (day.maxT - day.minT) * 7))}%` }}
                />
              </div>
              <span className="text-[#ef4444] w-8 text-left">{day.maxT}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
