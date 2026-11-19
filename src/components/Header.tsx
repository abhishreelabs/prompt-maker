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
  Activity
} from 'lucide-react';

interface HeaderProps {
  activeView: 'studio' | 'pipeline' | 'audit';
  setActiveView: (view: 'studio' | 'pipeline' | 'audit') => void;
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
  onOpenSettings,
  onOpenHistory,
  onOpenLearned,
  onOpenMcp,
  historyCount,
  engineUsed,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#0c0d14]/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand / Terminal breadcrumb */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-sm tracking-tight text-white">
                Prompt Maker
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400 border border-white/[0.08]">
                v0.1.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: View Switcher (Studio vs Pipeline vs Audit) */}
        <div className="hidden md:flex items-center space-x-1 bg-black/50 p-1 rounded-xl border border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveView('studio')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeView === 'studio'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeView === 'pipeline'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-amber-400" />
            <span>Pipeline</span>
          </button>

          <button
            onClick={() => setActiveView('audit')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeView === 'audit'
                ? 'bg-white/10 text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* MCP Connector */}
          <button
            onClick={onOpenMcp}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 transition-colors text-xs font-semibold cursor-pointer"
            title="Model Context Protocol (MCP) Server for Agents"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">MCP</span>
          </button>

          {/* Learned Workflows */}
          <button
            onClick={onOpenLearned}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 transition-colors text-xs font-semibold cursor-pointer"
            title="Browse real prompts learned from your 11 projects"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">11 Repos</span>
          </button>

          {/* Engine status badge */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-black/40 hover:border-white/20 transition-colors text-xs"
          >
            {engineUsed === 'offline' ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline">Offline (0$)</span>
              </>
            ) : engineUsed === 'gemini' ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-400 font-mono text-[11px] hidden sm:inline">Gemini AI</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400 font-mono text-[11px] hidden sm:inline">OpenAI</span>
              </>
            )}
          </div>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1 p-2 rounded-lg border border-white/[0.08] bg-black/40 hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors text-xs"
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
            className="p-2 rounded-lg border border-white/[0.08] bg-black/40 hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
