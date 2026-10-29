import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import CurrentWeather from '../components/CurrentWeather';
import WeatherMetrics from '../components/WeatherMetrics';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import WeatherMap from '../components/WeatherMap';
import SettingsModal from '../components/SettingsModal';
import { translations } from '../lib/translations';
import { fetchWeatherData, reverseGeocode } from '../lib/api';
import { RefreshCw, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const DEFAULT_LOCATION = {
  id: 'baku',
  name: 'Baku',
  country: 'Azerbaijan',
  latitude: 40.4093,
  longitude: 49.8671
};

export default function Home() {
  const [lang, setLang] = useState('en');
  const [tempUnit, setTempUnit] = useState('c');
  const [windUnit, setWindUnit] = useState('kmh');
  const [theme, setTheme] = useState('dark');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('weather_lang');
    if (savedLang && translations[savedLang]) setLang(savedLang);

    const savedTemp = localStorage.getItem('weather_temp_unit');
    if (savedTemp) setTempUnit(savedTemp);

    const savedWind = localStorage.getItem('weather_wind_unit');
    if (savedWind) setWindUnit(savedWind);

    const savedTheme = localStorage.getItem('weather_theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const savedLoc = localStorage.getItem('weather_last_location');
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        if (parsed.latitude && parsed.longitude) setLocation(parsed);
      } catch {}
    }
  }, []);

  const loadWeather = useCallback(async (loc) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc.latitude, loc.longitude);
      setWeatherData(data);
    } catch {
      setError(
        lang === 'az'
          ? 'Məlumatları əldə etmək mümkün olmadı. Zəhmət olmasa internet əlaqənizi yoxlayın.'
          : 'Unable to retrieve weather data. Please check your internet connection.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      loadWeather(location);
    }
  }, [location, loadWeather]);

  const handleSelectLocation = (newLoc) => {
    setLocation(newLoc);
    if (isClient) {
      localStorage.setItem('weather_last_location', JSON.stringify(newLoc));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'az' ? 'Geolokasiya bu brauzerdə dəstəklənmir.' : 'Geolocation is not supported by this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolved = await reverseGeocode(latitude, longitude);
        const userLoc = {
          id: `gps-${latitude}-${longitude}`,
          name: resolved.name,
          country: resolved.country,
          latitude,
          longitude
        };
        handleSelectLocation(userLoc);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert(lang === 'az' ? 'Mövqe təyin edilə bilmədi.' : 'Unable to determine location.');
      },
      { timeout: 10000 }
    );
  };

  const handleChangeLang = (newLang) => {
    setLang(newLang);
    if (isClient) localStorage.setItem('weather_lang', newLang);
  };

  const handleChangeTempUnit = (unit) => {
    setTempUnit(unit);
    if (isClient) localStorage.setItem('weather_temp_unit', unit);
  };

  const handleChangeWindUnit = (unit) => {
    setWindUnit(unit);
    if (isClient) localStorage.setItem('weather_wind_unit', unit);
  };

  const handleChangeTheme = (newTheme) => {
    setTheme(newTheme);
    if (isClient) {
      localStorage.setItem('weather_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <>
      <Head>
        <title>{t.appName} - {location.name}</title>
        <meta name="description" content="Modern and accurate real-time weather portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.jpg" />
      </Head>

      <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col font-sans">
        
        <Header
          t={t}
          onSelectLocation={handleSelectLocation}
          onGetLocation={handleGetLocation}
          isLocating={isLocating}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
          
          {error && (
            <div className="p-4 bg-[#ef4444]/15 border border-[#ef4444]/40 rounded-xl flex items-center justify-between text-sm text-[#fca5a5]">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadWeather(location)}
                className="px-3 py-1 bg-[#ef4444] text-white rounded-lg text-xs font-semibold hover:bg-[#dc2626]"
              >
                {t.retry || 'Retry'}
              </button>
            </div>
          )}

          {isLoading && !weatherData ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 size={40} className="animate-spin text-[#2563eb]" />
              <p className="text-[#94a3b8] text-sm font-medium">{t.searching}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#f8fafc]">
                    {location.name}
                  </h2>
                  <p className="text-xs text-[#94a3b8]">
                    {location.country ? `${location.country} • ` : ''}
                    {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                  </p>
                </div>
                <button
                  onClick={() => loadWeather(location)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#2563eb]' : ''} />
                  <span className="hidden sm:inline">{t.refresh || 'Refresh'}</span>
                </button>
              </div>

              <CurrentWeather
                location={location}
                weatherData={weatherData}
                t={t}
                lang={lang}
                tempUnit={tempUnit}
              />

              <WeatherMetrics
                weatherData={weatherData}
                t={t}
                lang={lang}
                windUnit={windUnit}
              />

              <HourlyForecast
                weatherData={weatherData}
                t={t}
                tempUnit={tempUnit}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyForecast
                  weatherData={weatherData}
                  t={t}
                  lang={lang}
                  tempUnit={tempUnit}
                />
                <WeatherMap
                  location={location}
                  t={t}
                />
              </div>
            </>
          )}

        </main>

        <footer className="w-full bg-[#111827] border-t border-[#243046] py-5 px-4 text-center text-xs text-[#64748b] mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="Void Weather" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-[#f8fafc] font-semibold">{t.appName}</span>
              <span className="text-[#64748b]">&copy; 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://artvoid.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-xs font-medium text-[#f8fafc] hover:border-[#2563eb] transition-all"
              >
                <span>Portfolio</span>
                <ExternalLink size={12} className="text-[#38bdf8]" />
              </a>

              <a
                href="https://github.com/artvoidfw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161f30] hover:bg-[#1e293b] border border-[#243046] text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] transition-all"
              >
                <span>GitHub</span>
              </a>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="hover:text-[#f8fafc] text-xs font-medium text-[#94a3b8] transition-colors"
              >
                {t.settings}
              </button>
            </div>
          </div>
        </footer>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          t={t}
          currentLang={lang}
          onChangeLang={handleChangeLang}
          tempUnit={tempUnit}
          onChangeTempUnit={handleChangeTempUnit}
          windUnit={windUnit}
          onChangeWindUnit={handleChangeWindUnit}
          theme={theme}
          onChangeTheme={handleChangeTheme}
        />

      </div>
    </>
  );
}
