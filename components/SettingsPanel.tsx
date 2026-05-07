
import React from 'react';
import { Language, BackspaceMode, ExamSettings } from '../types';
import { Settings, Globe, Timer, ShieldCheck, Highlighter, FileText, Edit3 } from 'lucide-react';

interface Props {
  settings: ExamSettings;
  setSettings: (s: ExamSettings) => void;
  disabled: boolean;
}

const SettingsPanel: React.FC<Props> = ({ settings, setSettings, disabled }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="font-bold text-lg">Exam Configuration</h2>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileText className="w-4 h-4" /> Mode
        </label>
        <div className="flex gap-2">
          <button
            disabled={disabled}
            onClick={() => setSettings({ ...settings, useCustomPassage: false })}
            className={`flex-1 py-2 text-xs font-semibold rounded-md border ${
              !settings.useCustomPassage ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white text-gray-500'
            }`}
          >
            Official Passages
          </button>
          <button
            disabled={disabled}
            onClick={() => setSettings({ ...settings, useCustomPassage: true })}
            className={`flex-1 py-2 text-xs font-semibold rounded-md border ${
              settings.useCustomPassage ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white text-gray-500'
            }`}
          >
            Custom Text
          </button>
        </div>
      </div>

      {settings.useCustomPassage && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Edit3 className="w-4 h-4" /> Paste Practice Text
          </label>
          <textarea
            disabled={disabled}
            value={settings.customPassage}
            onChange={(e) => setSettings({ ...settings, customPassage: e.target.value })}
            placeholder="Enter your custom passage here..."
            className="w-full h-32 text-sm p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          />
        </div>
      )}

      {/* Language Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Globe className="w-4 h-4" /> Language & Keyboard
        </label>
        <select
          disabled={disabled}
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value as Language })}
          className="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
        >
          {Object.values(Language).map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Timer Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Timer className="w-4 h-4" /> Exam Duration
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 5, 10, 15].map((m) => (
            <button
              key={m}
              disabled={disabled}
              onClick={() => setSettings({ ...settings, timerMinutes: m })}
              className={`py-2 text-xs font-semibold rounded-md border transition-colors ${
                settings.timerMinutes === m
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      {/* Backspace Mode */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <ShieldCheck className="w-4 h-4" /> Backspace Restriction
        </label>
        <div className="flex flex-col gap-2">
          {Object.values(BackspaceMode).map((mode) => (
            <label key={mode} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-gray-50">
              <input
                disabled={disabled}
                type="radio"
                name="backspace"
                checked={settings.backspaceMode === mode}
                onChange={() => setSettings({ ...settings, backspaceMode: mode })}
                className="text-indigo-600"
              />
              <span className="text-sm">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Highlighter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Highlighting Helper</span>
          </div>
          <input
            disabled={disabled}
            type="checkbox"
            checked={settings.highlightEnabled}
            onChange={(e) => setSettings({ ...settings, highlightEnabled: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Show Live Stats</span>
          </div>
          <input
            disabled={disabled}
            type="checkbox"
            checked={settings.showStats}
            onChange={(e) => setSettings({ ...settings, showStats: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>
      </div>
    </div>
  );
};

export default SettingsPanel;
