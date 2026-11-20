import React, { useState } from 'react';
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
  Moon,
  Database,
  Menu,
  X
} from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface HeaderProps {
  activeView: 'studio' | 'pipeline' | 'audit';
  setActiveView: (view: 'studio' | 'pipeline' | 'audit') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenLearned: () => void;
  onOpenMcp: () => void;
  onOpenInsights: () => void;
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
  onOpenInsights,
  historyCount,
  engineUsed,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0e17]/90 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <Sparkles className="w-4 h-4 text-white font-bold" />
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="font-outfit font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Prompt Maker
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
              v0.1.0
            </span>
          </div>
        </div>

        {/* Center: View Switcher for Desktop (Studio vs Pipeline vs Audit) */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-black/50 p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs">
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
          {/* MCP Connector */}
          <button
            onClick={onOpenMcp}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100 dark:hover:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 transition-colors text-xs font-outfit font-semibold cursor-pointer"
            title="Model Context Protocol (MCP) Server for Agents"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>MCP</span>
          </button>

          {/* Curated Blueprints */}
          <button
            onClick={onOpenLearned}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 transition-colors text-xs font-outfit font-semibold cursor-pointer"
            title="Browse curated production blueprints across 14 engineering domains"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Blueprints</span>
          </button>

          {/* Cloudflare D1 Edge Intelligence */}
          <button
            onClick={onOpenInsights}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 transition-colors text-xs font-outfit font-semibold cursor-pointer"
            title="Cloudflare D1 Edge Insights (Zero-PII Quality Metrics)"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">D1 Insights</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          </button>

          {/* Engine status badge */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 hover:border-slate-300 dark:hover:border-white/20 transition-colors text-xs font-outfit font-semibold"
          >
            {engineUsed === 'offline' ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-xs font-semibold hidden lg:inline">Offline (0$)</span>
              </>
            ) : engineUsed === 'gemini' ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
                <span className="text-amber-700 dark:text-amber-400 font-mono text-xs font-semibold hidden lg:inline">Gemini AI</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-400 font-mono text-xs font-semibold hidden lg:inline">OpenAI</span>
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
              <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-amber-500 text-black font-bold">
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

          {/* GitHub Repository */}
          <a
            href="https://github.com/abhishreelabs/prompt-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 p-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300 transition-colors text-xs"
            title="GitHub: Documentation, CLI & Source"
          >
            <GithubIcon />
            <span className="hidden xl:inline font-outfit font-semibold">GitHub</span>
          </a>

          {/* Light / Dark Mode Toggle */}
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

        {/* Mobile Header Controls (< 768px) */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Theme Quick Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            {historyCount > 0 && !isMobileMenuOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0c0e17]/95 backdrop-blur-2xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* View switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-black/50 p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs">
            <button
              onClick={() => handleMobileNav(() => setActiveView('studio'))}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-outfit font-semibold transition-all ${
                activeView === 'studio'
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => handleMobileNav(() => setActiveView('pipeline'))}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-outfit font-semibold transition-all ${
                activeView === 'pipeline'
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-amber-500" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => handleMobileNav(() => setActiveView('audit'))}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-outfit font-semibold transition-all ${
                activeView === 'audit'
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Audit</span>
            </button>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleMobileNav(onOpenLearned)}
              className="flex items-center space-x-2 p-2.5 rounded-xl border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 font-outfit font-semibold text-left"
            >
              <FolderGit2 className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="truncate">
                <div className="font-bold">Blueprints</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 opacity-80">19 Workflows</div>
              </div>
            </button>

            <button
              onClick={() => handleMobileNav(onOpenInsights)}
              className="flex items-center space-x-2 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-outfit font-semibold text-left"
            >
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="truncate">
                <div className="font-bold">D1 Insights</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 opacity-80">Zero-PII Live</div>
              </div>
            </button>

            <button
              onClick={() => handleMobileNav(onOpenMcp)}
              className="flex items-center space-x-2 p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-50/80 dark:bg-cyan-950/20 text-cyan-800 dark:text-cyan-300 font-outfit font-semibold text-left"
            >
              <Bot className="w-4 h-4 text-cyan-500 shrink-0" />
              <div className="truncate">
                <div className="font-bold">MCP Agent</div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 opacity-80">Cursor / Windsurf</div>
              </div>
            </button>

            <button
              onClick={() => handleMobileNav(onOpenHistory)}
              className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-black/30 text-slate-800 dark:text-slate-200 font-outfit font-semibold text-left"
            >
              <History className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="truncate">
                <div className="font-bold">History ({historyCount})</div>
                <div className="text-[10px] text-slate-500 opacity-80">Saved drafts</div>
              </div>
            </button>
          </div>

          {/* Settings & External Links */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs">
            <button
              onClick={() => handleMobileNav(onOpenSettings)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/40 text-slate-700 dark:text-slate-300 font-outfit font-semibold"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings &amp; Keys</span>
            </button>

            <a
              href="https://github.com/abhishreelabs/prompt-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/40 text-slate-700 dark:text-slate-300 font-outfit font-semibold"
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};