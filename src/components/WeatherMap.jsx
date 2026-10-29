import React from 'react';
import { Map, ExternalLink } from 'lucide-react';

export default function WeatherMap({
  location,
  t
}) {
  if (!location || !location.latitude || !location.longitude) {
    return null;
  }

  const { latitude, longitude, name } = location;
  const bbox = `${longitude - 0.15},${latitude - 0.1},${longitude + 0.15},${latitude + 0.1}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="w-full bg-[#161f30] border border-[#243046] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#f8fafc] flex items-center gap-2">
          <Map size={18} className="text-[#2563eb]" />
          <span>{t.radarMap}</span>
        </h2>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#38bdf8] hover:text-[#f8fafc] flex items-center gap-1 font-medium transition-colors"
        >
          <span>Google Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-[#243046] relative bg-[#111827]">
        <iframe
          title="Weather Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={embedUrl}
          className="w-full h-full filter invert hue-rotate-180 contrast-95 opacity-90"
        />
        <div className="absolute bottom-3 left-3 bg-[#111827]/90 border border-[#243046] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#f8fafc] shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span>{name} ({latitude.toFixed(2)}°, {longitude.toFixed(2)}°)</span>
        </div>
      </div>
    </div>
  );
}
