import React from 'react';
import { X, Check, Globe, Thermometer, Wind, Moon, Sun } from 'lucide-react';
import { languages } from '../lib/translations';

export default function SettingsModal({
  isOpen,
  onClose,
  t,
  currentLang,
  onChangeLang,
  tempUnit,
  onChangeTempUnit,
  windUnit,
  onChangeWindUnit,
  theme,
  onChangeTheme
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#111827] border border-[#243046] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#243046]">
          <h2 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
            <span>{t.settings}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          <div>
            <label className="text-sm font-semibold text-[#f8fafc] flex items-center gap-2 mb-3">
              <Globe size={16} className="text-[#2563eb]" />
              <span>{t.language} ({languages.length}+)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((item) => {
                const isActive = item.code === currentLang;
                return (
                  <button
                    key={item.code}
                    onClick={() => onChangeLang(item.code)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-[#2563eb] text-white border-[#3b82f6]' 
                        : 'bg-[#161f30] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] border-[#243046]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                    {isActive && <Check size={16} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#161f30] border border-[#243046] rounded-xl p-4">
              <label className="text-sm font-semibold text-[#f8fafc] flex items-center gap-2 mb-3">
                <Thermometer size={16} className="text-[#f59e0b]" />
                <span>{t.temperatureUnit}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChangeTempUnit('c')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    tempUnit === 'c'
                      ? 'bg-[#2563eb] text-white border-[#3b82f6]'
                      : 'bg-[#111827] text-[#94a3b8] hover:text-[#f8fafc] border-[#243046]'
                  }`}
                >
                  °C (Celsius)
                </button>
                <button
                  onClick={() => onChangeTempUnit('f')}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    tempUnit === 'f'
                      ? 'bg-[#2563eb] text-white border-[#3b82f6]'
                      : 'bg-[#111827] text-[#94a3b8] hover:text-[#f8fafc] border-[#243046]'
                  }`}
                >
                  °F (Fahrenheit)
                </button>
              </div>
            </div>

            <div className="bg-[#161f30] border border-[#243046] rounded-xl p-4">
              <label className="text-sm font-semibold text-[#f8fafc] flex items-center gap-2 mb-3">
                <Wind size={16} className="text-[#38bdf8]" />
                <span>{t.windSpeedUnit}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['kmh', 'ms', 'mph'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => onChangeWindUnit(unit)}
                    className={`py-2 rounded-lg text-xs font-semibold border uppercase transition-all ${
                      windUnit === unit
                        ? 'bg-[#2563eb] text-white border-[#3b82f6]'
                        : 'bg-[#111827] text-[#94a3b8] hover:text-[#f8fafc] border-[#243046]'
                    }`}
                  >
                    {t[unit] || unit}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-[#161f30] border border-[#243046] rounded-xl p-4">
            <label className="text-sm font-semibold text-[#f8fafc] flex items-center gap-2 mb-3">
              {theme === 'dark' ? <Moon size={16} className="text-[#a855f7]" /> : <Sun size={16} className="text-[#eab308]" />}
              <span>{t.theme}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeTheme('dark')}
                className={`py-2 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#2563eb] text-white border-[#3b82f6]'
                    : 'bg-[#111827] text-[#94a3b8] hover:text-[#f8fafc] border-[#243046]'
                }`}
              >
                <Moon size={16} />
                <span>{t.dark}</span>
              </button>
              <button
                onClick={() => onChangeTheme('light')}
                className={`py-2 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-[#2563eb] text-white border-[#3b82f6]'
                    : 'bg-[#111827] text-[#94a3b8] hover:text-[#f8fafc] border-[#243046]'
                }`}
              >
                <Sun size={16} />
                <span>{t.light}</span>
              </button>
            </div>
          </div>

        </div>

        <div className="px-6 py-4 border-t border-[#243046] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
}
