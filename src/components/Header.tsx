import React from 'react';
import {
  Sparkles,
  Settings,
  History,
  Cpu,
  Zap,
  FolderGit2,
  Bot,
  Columns2,
  GitFork,
  Activity,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  activeView: 'studio' | 'pipeline' | 'audit';
  setActiveView: (view: 'studio' | 'pipeline' | 'audit') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenLearned: () => void;
  onOpenMcp: () => void;
  historyCount: number;
  engineUsed: 'offline' | 'gemini' | 'openai';
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  theme,
  onToggleTheme,
  onOpenSettings,
  onOpenHistory,
  onOpenLearned,
  onOpenMcp,
  historyCount,
  engineUsed,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0e17]/90 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Sparkles className="w-4 h-4 text-white font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-outfit font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Prompt Maker
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08]">
                v0.1.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: View Switcher (Studio vs Pipeline vs Audit) */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-black/50 p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveView('studio')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-outfit font-semibold transition-all cursor-pointer ${
              activeView === 'studio'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-outfit font-semibold transition-all cursor-pointer ${
              activeView === 'pipeline'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Pipeline</span>
          </button>

          <button
            onClick={() => setActiveView('audit')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-outfit font-semibold transition-all cursor-pointer ${
              activeView === 'audit'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Audit</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* MCP Connector */}
          <button
            onClick={onOpenMcp}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100 dark:hover:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 transition-colors text-xs font-outfit font-semibold cursor-pointer"
            title="Model Context Protocol (MCP) Server for Agents"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>MCP</span>
          </button>

          {/* Learned Workflows */}
          <button
            onClick={onOpenLearned}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 transition-colors text-xs font-outfit font-semibold cursor-pointer"
            title="Browse real prompts learned from your 11 projects"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>11 Repos</span>
          </button>

          {/* Engine status badge */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 hover:border-slate-300 dark:hover:border-white/20 transition-colors text-xs font-outfit font-semibold"
          >
            {engineUsed === 'offline' ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] hidden sm:inline">Offline (0$)</span>
              </>
            ) : engineUsed === 'gemini' ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
                <span className="text-amber-700 dark:text-amber-400 font-mono text-[11px] hidden sm:inline">Gemini AI</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-400 font-mono text-[11px] hidden sm:inline">OpenAI</span>
              </>
            )}
          </div>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1 p-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 transition-colors text-xs cursor-pointer"
            title="Prompt History"
          >
            <History className="w-3.5 h-3.5" />
            {historyCount > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-amber-500 text-black font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Light / Dark Mode Toggle Pill */}
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 transition-colors text-xs font-outfit font-semibold cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
