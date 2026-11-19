import React from 'react';
import { Sparkles, Settings, History, Cpu, Zap, FolderGit2 } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenLearned: () => void;
  historyCount: number;
  engineUsed: 'offline' | 'gemini' | 'openai';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenHistory,
  onOpenLearned,
  historyCount,
  engineUsed,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Prompt Maker
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Dev Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Turn rough developer drafts into elite, production-grade AI prompts
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Learned from Sessions Pill Button */}
          <button
            onClick={onOpenLearned}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors text-xs font-semibold cursor-pointer shadow-sm shadow-amber-500/10"
            title="Browse real prompts learned from your project workspaces & sessions"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Learned Workflows</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono">
              11 Repos
            </span>
          </button>

          {/* Active Engine Badge */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-colors text-xs"
          >
            {engineUsed === 'offline' ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-medium hidden md:inline">Smart Engine:</span>
                <span className="text-emerald-400 font-semibold">Offline (Zero Cost)</span>
              </>
            ) : engineUsed === 'gemini' ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-slate-300 font-medium hidden md:inline">Engine:</span>
                <span className="text-amber-400 font-semibold">Gemini 2.5 Active</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-300 font-medium hidden md:inline">Engine:</span>
                <span className="text-blue-400 font-semibold">OpenAI Active</span>
              </>
            )}
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium relative"
            title="Prompt History"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold ml-1">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

