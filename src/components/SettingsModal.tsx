import React, { useState } from 'react';
import { SettingsState } from '../types';
import { X, Key, Shield, Cpu, Sparkles, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSaveSettings: (settings: SettingsState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [form, setForm] = useState<SettingsState>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-transparent">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Engine & API Settings</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Configure offline heuristics or AI enhancement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Engine Mode */}
          <div>
            <label className="block text-slate-900 dark:text-slate-300 font-semibold mb-1.5">
              Engine Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, preferredEngine: 'hybrid' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  form.preferredEngine === 'hybrid'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-950 dark:bg-indigo-600/20 dark:border-indigo-500 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-semibold text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Hybrid / AI</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Uses Gemini/OpenAI if key is present, auto-falls back to offline templates.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, preferredEngine: 'offline-only' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  form.preferredEngine === 'offline-only'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 dark:bg-emerald-600/20 dark:border-emerald-500 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-semibold text-xs mb-1">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Offline Only</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Zero external calls. 100% private, instant heuristic prompt synthesis.
                </p>
              </button>
            </div>
          </div>

          {/* Gemini API Key */}
          {form.preferredEngine === 'hybrid' && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <div>
                <label className="block text-slate-900 dark:text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>Google Gemini API Key (Optional)</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Get Free Key &rarr;
                  </a>
                </label>
                <input
                  type="password"
                  value={form.geminiApiKey}
                  onChange={e => setForm(f => ({ ...f, geminiApiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-900 dark:text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>OpenAI API Key (Optional)</span>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Get Key &rarr;
                  </a>
                </label>
                <input
                  type="password"
                  value={form.openaiApiKey}
                  onChange={e => setForm(f => ({ ...f, openaiApiKey: e.target.value }))}
                  placeholder="sk-proj-..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Privacy note */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Your API keys are stored strictly in your local browser <code className="text-slate-800 dark:text-slate-300 font-mono">localStorage</code>. They never leave your device except to query the official API directly.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
