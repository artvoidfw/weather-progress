import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Settings as SettingsIcon, Loader2, X } from 'lucide-react';
import { searchLocations } from '../lib/api';

export default function Header({ 
  t, 
  onSelectLocation, 
  onGetLocation, 
  isLocating, 
  onOpenSettings
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(query.trim());
      setResults(res);
      setIsSearching(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-[#111827] border-b border-[#243046] sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/logo.jpg"
              alt="Void Weather"
              className="w-10 h-10 rounded-xl object-cover border border-[#243046] shadow-md shrink-0"
            />
            <div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-[#f8fafc] block leading-tight">
                {t.appName}
              </span>
              <span className="text-xs text-[#94a3b8] font-medium block">
                {time}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onGetLocation}
              disabled={isLocating}
              className="p-2.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
              title={t.currentLocation}
            >
              {isLocating ? <Loader2 size={18} className="animate-spin text-[#2563eb]" /> : <MapPin size={18} />}
            </button>
            <a
              href="https://github.com/artvoidfw"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-[#94a3b8] hover:text-[#f8fafc] transition-colors flex items-center justify-center"
              title="GitHub"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
            </a>
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
              title={t.settings}
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        <div className="w-full md:max-w-xl relative" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-[#64748b]" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#161f30] border border-[#243046] text-[#f8fafc] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#2563eb] transition-all"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-3 text-[#64748b] hover:text-[#f8fafc]"
              >
                <X size={16} />
              </button>
            ) : isSearching ? (
              <div className="absolute right-3">
                <Loader2 size={16} className="animate-spin text-[#2563eb]" />
              </div>
            ) : null}
          </div>

          {isOpen && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-[#161f30] border border-[#243046] rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-[#94a3b8] flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[#2563eb]" />
                  <span>{t.searching}</span>
                </div>
              ) : results.length > 0 ? (
                <div className="py-1">
                  {results.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className="w-full text-left px-4 py-3 hover:bg-[#1e293b] flex items-center justify-between transition-colors border-b border-[#243046]/50 last:border-b-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin size={16} className="text-[#2563eb] shrink-0" />
                        <div>
                          <span className="font-semibold text-sm text-[#f8fafc] block">
                            {loc.name}
                          </span>
                          <span className="text-xs text-[#94a3b8]">
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#64748b] bg-[#111827] px-2 py-0.5 rounded border border-[#243046]">
                        {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="p-4 text-center text-sm text-[#64748b]">
                  {t.noResults}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onGetLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-[#f8fafc] text-sm font-medium transition-colors"
          >
            {isLocating ? (
              <Loader2 size={16} className="animate-spin text-[#2563eb]" />
            ) : (
              <MapPin size={16} className="text-[#2563eb]" />
            )}
            <span>{isLocating ? t.locating : t.currentLocation}</span>
          </button>

          <a
            href="https://github.com/artvoidfw"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-[#94a3b8] hover:text-[#f8fafc] transition-colors flex items-center justify-center"
            title="GitHub - artvoidfw"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
            </svg>
          </a>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-[#f8fafc] text-sm font-medium transition-colors"
          >
            <SettingsIcon size={16} className="text-[#94a3b8]" />
            <span>{t.settings}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
