import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

export default function HourlyForecast({
  weatherData,
  t,
  tempUnit
}) {
  if (!weatherData || !weatherData.weather || !weatherData.weather.hourly) {
    return null;
  }

  const { hourly } = weatherData.weather;
  const times = hourly.time || [];
  const temps = hourly.temperature_2m || [];
  const codes = hourly.weather_code || [];
  const precipProbs = hourly.precipitation_probability || [];

  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13);

  let startIndex = times.findIndex((tStr) => tStr.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const next24 = times.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    const hourDate = new Date(timeStr);
    const hourNum = hourDate.getHours();
    const isDayTime = hourNum >= 6 && hourNum < 20 ? 1 : 0;
    const isNow = idx === 0;

    let temp = Math.round(temps[actualIdx]);
    if (tempUnit === 'f') {
      temp = Math.round((temp * 9) / 5 + 32);
    }

    return {
      time: isNow ? t.now : `${String(hourNum).padStart(2, '0')}:00`,
      code: codes[actualIdx] ?? 0,
      isDay: isDayTime,
      temp,
      precip: precipProbs[actualIdx] ?? 0,
      isNow
    };
  });

  return (
    <div className="w-full bg-[#161f30] border border-[#243046] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
          <Clock size={18} className="text-[#2563eb]" />
          <span>{t.hourlyForecast}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 custom-scrollbar">
        {next24.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-between py-3.5 px-4 rounded-xl border shrink-0 min-w-[85px] transition-all ${
              item.isNow
                ? 'bg-[#2563eb] text-white border-[#3b82f6]'
                : 'bg-[#111827] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] border-[#243046]'
            }`}
          >
            <span className={`text-xs font-semibold ${item.isNow ? 'text-white' : 'text-[#f8fafc]'}`}>
              {item.time}
            </span>

            <div className="my-2.5">
              <WeatherIcon code={item.code} isDay={item.isDay} size={28} />
            </div>

            <span className={`text-sm font-extrabold ${item.isNow ? 'text-white' : 'text-[#f8fafc]'}`}>
              {item.temp}°
            </span>

            <div className="flex items-center gap-1 mt-2 text-[11px] font-medium opacity-80">
              <Droplets size={11} className={item.isNow ? 'text-white' : 'text-[#38bdf8]'} />
              <span>{item.precip}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
