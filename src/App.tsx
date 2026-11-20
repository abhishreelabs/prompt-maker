import { useState, useEffect } from 'react';
import type { UseCaseId, TargetModel, PromptTone, PromptTransformationResult, SettingsState, LearnedPromptItem } from './types/index.ts';
import { Header } from './components/Header';
import { BadPromptInput } from './components/BadPromptInput';
import { GoodPromptOutput } from './components/GoodPromptOutput';
import { AnalysisCard } from './components/AnalysisCard';
import { PromptPipelineView } from './components/PromptPipelineView';
import { SettingsModal } from './components/SettingsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { LearnedPromptsModal } from './components/LearnedPromptsModal';
import { McpModal } from './components/McpModal';
import { enhancePromptOffline } from './engine/offlineEnhancer.ts';
import { enhancePromptWithAi } from './engine/aiEnhancer.ts';
import { USE_CASES } from './data/useCases.ts';
import { LEARNED_USER_PROMPTS } from './data/learnedPrompts.ts';
import { Sparkles, Terminal, ArrowRight, ShieldCheck, Zap, FolderGit2 } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'prompt_maker_history_v1';
const STORAGE_KEY_SETTINGS = 'prompt_maker_settings_v1';

export function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialView = (urlParams.get('view') as 'studio' | 'pipeline' | 'audit') || 'studio';
  const initialTheme = (urlParams.get('theme') as 'dark' | 'light') ||
    (typeof window !== 'undefined' ? (localStorage.getItem('prompt_maker_theme') as 'dark' | 'light') : null) ||
    'dark';

  const [activeView, setActiveView] = useState<'studio' | 'pipeline' | 'audit'>(initialView);
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);
  const [rawPrompt, setRawPrompt] = useState('test the login form with email and password and check if error shows up when invalid');
  const [useCase, setUseCase] = useState<UseCaseId>('ui-testing');
  const [framework, setFramework] = useState('Playwright (TypeScript)');
  const [targetModel, setTargetModel] = useState<TargetModel>('claude');
  const [tone, setTone] = useState<PromptTone>('production');
  const [projectContext, setProjectContext] = useState<string>('Prompt Maker (React 19 + TypeScript + Vite + Tailwind CSS)');

  const [result, setResult] = useState<PromptTransformationResult | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLearnedOpen, setIsLearnedOpen] = useState(false);
  const [isMcpOpen, setIsMcpOpen] = useState(false);

  // Sync theme with documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem('prompt_maker_theme', theme);
    } catch {
      // Fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  // Settings state from localStorage
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      geminiApiKey: '',
      openaiApiKey: '',
      defaultModel: 'claude',
      preferredEngine: 'hybrid'
    };
  });

  // History state from localStorage
  const [history, setHistory] = useState<PromptTransformationResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Save settings
  const handleSaveSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    } catch {
      // Fallback
    }
  };

  // Save history
  const saveToHistory = (item: PromptTransformationResult) => {
    setHistory(prev => {
      const next = [item, ...prev.filter(p => p.timestamp !== item.timestamp)].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // Fallback
    }
  };

  // Auto-generate initial prompt on first load so user immediately sees value!
  useEffect(() => {
    if (!result && rawPrompt) {
      const initial = enhancePromptOffline({
        rawPrompt,
        useCase,
        targetModel,
        tone,
        framework,
        projectContext
      });
      setResult(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransform = async () => {
    if (!rawPrompt.trim()) return;
    setIsTransforming(true);

    try {
      let finalResult: PromptTransformationResult;

      const shouldUseAi =
        settings.preferredEngine === 'hybrid' &&
        (settings.geminiApiKey.trim() || settings.openaiApiKey.trim());

      if (shouldUseAi) {
        finalResult = await enhancePromptWithAi({
          rawPrompt,
          useCase,
          targetModel,
          tone,
          framework,
          apiKey: settings.geminiApiKey || settings.openaiApiKey,
          modelProvider: settings.geminiApiKey ? 'gemini' : 'openai'
        });
      } else {
        // Artificial short delay for pleasing UX feedback
        await new Promise(r => setTimeout(r, 250));
        finalResult = enhancePromptOffline({
          rawPrompt,
          useCase,
          targetModel,
          tone,
          framework,
          projectContext
        });
      }

      setResult(finalResult);
      saveToHistory(finalResult);
    } catch (err) {
      console.error('Transformation failed:', err);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleSelectFromHistory = (item: PromptTransformationResult) => {
    setRawPrompt(item.originalPrompt);
    setUseCase(item.useCase);
    setTargetModel(item.targetModel);
    setTone(item.tone);
    if (item.framework) setFramework(item.framework);
    setResult(item);
  };

  const handleSelectLearnedPrompt = (item: LearnedPromptItem) => {
    setRawPrompt(item.rawUserPrompt);
    setUseCase(item.category);
    setFramework(item.targetStack);
    // Instant preview
    const enhanced = enhancePromptOffline({
      rawPrompt: item.rawUserPrompt,
      useCase: item.category,
      targetModel,
      tone,
      framework: item.targetStack,
      projectContext: item.project
    });
    setResult(enhanced);
    saveToHistory(enhanced);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const currentEngine: 'offline' | 'gemini' | 'openai' =
    settings.preferredEngine === 'hybrid' && settings.geminiApiKey.trim()
      ? 'gemini'
      : settings.preferredEngine === 'hybrid' && settings.openaiApiKey.trim()
      ? 'openai'
      : 'offline';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090a0f] text-slate-100' : 'bg-[#f8f9fa] text-slate-900'} flex flex-col font-sans bg-blueprint-grid transition-colors duration-200`}>
      {/* Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenLearned={() => setIsLearnedOpen(true)}
        onOpenMcp={() => setIsMcpOpen(true)}
        historyCount={history.length}
        engineUsed={currentEngine}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner with Glowing Fluid Wave Ribbon */}
        <div className="relative overflow-hidden rounded-2xl craft-chassis p-6 sm:p-7 border border-slate-200 dark:border-white/[0.08] shadow-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-cyan-50/70 dark:from-[#0c0f1a] dark:via-[#0e1222] dark:to-[#0a0c16]">
          {/* Fluid Wave Ribbon Background SVG */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <svg
              className="absolute right-0 top-0 bottom-0 h-full w-[65%] min-w-[380px] opacity-90 dark:opacity-80"
              viewBox="0 0 650 200"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="auroraRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="auroraRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                  <stop offset="60%" stopColor="#6366f1" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                </linearGradient>
                <radialGradient id="auroraCenter" cx="70%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#auroraCenter)" />
              <path
                d="M120,200 C240,160 260,60 420,40 C520,25 580,80 650,60 L650,200 Z"
                fill="url(#auroraRibbon1)"
              />
              <path
                d="M200,200 C300,140 380,95 490,75 C570,60 610,105 650,85 L650,200 Z"
                fill="url(#auroraRibbon2)"
              />
              <path
                d="M150,200 Q320,80 500,60 T650,25"
                stroke="url(#auroraRibbon2)"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M240,200 Q390,110 570,55 T650,45"
                stroke="url(#auroraRibbon1)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-outfit font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Compiler Deck &bull; Architecture Hardener</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-outfit font-extrabold tracking-tight text-slate-900 dark:text-white">
                Don&apos;t Let Vague Prompts Generate Broken Code.
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans max-w-xl">
                Transform rough developer drafts into bulletproof AI prompts with accessible locators, auto-wait assertions, boundary tests, and explicit output schemas.
              </p>
            </div>

            {/* Quick stats pills matching Image 1 & 2 */}
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsLearnedOpen(true)}
                className="flex items-center space-x-2.5 text-xs font-outfit font-semibold bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 px-3.5 py-2 rounded-xl border border-amber-500/30 text-amber-700 dark:text-amber-300 transition-all shadow-xs cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4 text-amber-500" />
                <span>Learned from 11 Repos</span>
              </button>
              <div className="flex items-center space-x-2.5 text-xs font-outfit font-semibold bg-white/90 dark:bg-black/60 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>16 Domain Presets</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-outfit font-semibold bg-white/90 dark:bg-black/60 px-3.5 py-2 rounded-xl border border-purple-500/30 text-purple-700 dark:text-purple-300 shadow-xs">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>Zero-Cost Offline First</span>
              </div>
            </div>
          </div>
        </div>

        {/* View switching logic */}
        {activeView === 'studio' && (
          <div className="space-y-6">
            {/* Split Screen Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Left Column: Bad Prompt Input */}
              <BadPromptInput
                rawPrompt={rawPrompt}
                setRawPrompt={setRawPrompt}
                useCase={useCase}
                setUseCase={setUseCase}
                framework={framework}
                setFramework={setFramework}
                targetModel={targetModel}
                setTargetModel={setTargetModel}
                tone={tone}
                setTone={setTone}
                projectContext={projectContext}
                setProjectContext={setProjectContext}
                onTransform={handleTransform}
                isTransforming={isTransforming}
                onOpenLearned={() => setIsLearnedOpen(true)}
              />

              {/* Right Column: Good Prompt Output */}
              <GoodPromptOutput
                result={result}
                isTransforming={isTransforming}
              />
            </div>

            {/* Pipeline and Audit inside Studio */}
            {result && (
              <>
                <PromptPipelineView result={result} />
                <AnalysisCard result={result} />
              </>
            )}
          </div>
        )}

        {activeView === 'pipeline' && result && (
          <div className="space-y-6">
            <PromptPipelineView result={result} />
            <AnalysisCard result={result} />
          </div>
        )}

        {activeView === 'audit' && result && (
          <div className="space-y-6">
            <AnalysisCard result={result} />
            <PromptPipelineView result={result} />
          </div>
        )}

        {/* Showcase: Learned from Your Real Workspace Sessions */}
        <div className="craft-chassis rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl border border-slate-200 dark:border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <FolderGit2 className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Discovered From Your Real Projects & Developer Sessions
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                  Extracted from real developer sessions across WebSockets, Healthcare, Cloud SRE, Document AI, and Video Streaming.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLearnedOpen(true)}
              className="text-xs sm:text-sm font-outfit text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center space-x-1.5 font-bold self-start sm:self-auto cursor-pointer group"
            >
              <span>View All {LEARNED_USER_PROMPTS.length} Workflows</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {LEARNED_USER_PROMPTS.slice(0, 6).map(item => (
              <div
                key={item.id}
                onClick={() => handleSelectLearnedPrompt(item)}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] hover:border-amber-500/60 hover:bg-white dark:hover:bg-black/60 transition-all cursor-pointer space-y-3 group shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-300 font-mono tracking-tight truncate">
                    {item.project}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 shrink-0">
                    {item.category}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono line-clamp-2 leading-relaxed">
                  &ldquo;{item.rawUserPrompt}&rdquo;
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 border-t border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 gap-2">
                  <span className="truncate max-w-[200px] font-mono">{item.targetStack}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1 shrink-0">
                    <span>Enhance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Use Case Directory / Cheat-sheet */}
        <div className="craft-chassis rounded-2xl p-6 sm:p-7 space-y-5 border border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-outfit text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  All Supported Engineering Domains ({USE_CASES.length})
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                  Click any engineering domain to load tested frameworks, sample bad prompts, and automated safeguards.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {USE_CASES.map(uc => (
              <div
                key={uc.id}
                onClick={() => {
                  setUseCase(uc.id);
                  setFramework(uc.defaultFramework);
                  if (uc.sampleBadPrompts[0]) {
                    setRawPrompt(uc.sampleBadPrompts[0].prompt);
                  }
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs space-y-2.5 ${
                  uc.id === useCase
                    ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-500/70 text-slate-900 dark:text-white shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-black/50'
                }`}
              >
                <div className="flex items-center justify-between text-sm sm:text-base font-bold font-outfit mb-1">
                  <span className="text-slate-900 dark:text-slate-100">{uc.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-sans">
                  {uc.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-white/[0.08] text-xs font-mono text-amber-700 dark:text-amber-400 flex items-center space-x-1.5 font-medium">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Default:</span>
                  <span className="truncate">{uc.defaultFramework}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-7 text-center text-sm text-slate-600 dark:text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-slate-800 dark:text-slate-200">Prompt Maker</span> &mdash; The Developer&apos;s Meta-Prompt Assistant
          </div>
          <div className="flex items-center space-x-4 text-xs sm:text-sm">
            <span>Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded font-mono text-xs font-bold shadow-xs">⌘ + Enter</kbd> to compile</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
            >
              Configure API Keys
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectPrompt={handleSelectFromHistory}
        onClearHistory={handleClearHistory}
      />

      <LearnedPromptsModal
        isOpen={isLearnedOpen}
        onClose={() => setIsLearnedOpen(false)}
        onSelectPrompt={handleSelectLearnedPrompt}
      />

      <McpModal
        isOpen={isMcpOpen}
        onClose={() => setIsMcpOpen(false)}
      />
    </div>
  );
}
export default App;
