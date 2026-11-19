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
  const [activeView, setActiveView] = useState<'studio' | 'pipeline' | 'audit'>(initialView);
  const [rawPrompt, setRawPrompt] = useState('test the login form with email and password and check if error shows up when invalid');
  const [useCase, setUseCase] = useState<UseCaseId>('ui-testing');
  const [framework, setFramework] = useState('Playwright (TypeScript)');
  const [targetModel, setTargetModel] = useState<TargetModel>('claude');
  const [tone, setTone] = useState<PromptTone>('production');

  const [result, setResult] = useState<PromptTransformationResult | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLearnedOpen, setIsLearnedOpen] = useState(false);
  const [isMcpOpen, setIsMcpOpen] = useState(false);

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
        framework
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
          framework
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
      framework: item.targetStack
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
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans bg-blueprint-grid">
      {/* Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenLearned={() => setIsLearnedOpen(true)}
        onOpenMcp={() => setIsMcpOpen(true)}
        historyCount={history.length}
        engineUsed={currentEngine}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl craft-chassis p-5 sm:p-6 border border-white/[0.08] shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Compiler Deck &bull; Architecture Hardener</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                Don&apos;t Let Vague Prompts Generate Broken Code.
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Transform rough developer drafts into bulletproof AI prompts with accessible locators, auto-wait assertions, boundary tests, and explicit output schemas.
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsLearnedOpen(true)}
                className="flex items-center space-x-2 text-xs bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-300 transition-colors cursor-pointer font-mono"
              >
                <FolderGit2 className="w-4 h-4 text-amber-400" />
                <span>Learned from 11 Repos</span>
              </button>
              <div className="flex items-center space-x-2 text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.08] text-slate-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>16 Domain Presets</span>
              </div>
              <div className="flex items-center space-x-2 text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.08] text-slate-300 font-mono">
                <Zap className="w-4 h-4 text-amber-400" />
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
        <div className="craft-chassis rounded-2xl p-6 space-y-4 shadow-xl border border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-2.5">
              <FolderGit2 className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Discovered From Your Real Projects & Developer Sessions
                </h3>
                <p className="text-xs text-slate-400">
                  Extracted from actual sessions in WhisperRoom, Hospital Management, Sentinel, Terrace Farming, and Interview Portal.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLearnedOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-semibold self-start sm:self-auto cursor-pointer"
            >
              <span>View All {LEARNED_USER_PROMPTS.length} Workflows &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {LEARNED_USER_PROMPTS.slice(0, 6).map(item => (
              <div
                key={item.id}
                onClick={() => handleSelectLearnedPrompt(item)}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-amber-500/50 hover:bg-black/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-300 font-mono">
                    {item.project}
                  </span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold font-mono">
                    {item.category}
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-mono line-clamp-2">
                  &ldquo;{item.rawUserPrompt}&rdquo;
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.06] text-slate-400">
                  <span className="truncate max-w-[180px] font-mono">{item.targetStack}</span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5">
                    <span>Enhance</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Use Case Directory / Cheat-sheet */}
        <div className="craft-chassis rounded-2xl p-6 space-y-4 border border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h3 className="font-display text-sm font-bold text-slate-200 uppercase tracking-wider">
              All Supported Engineering Domains ({USE_CASES.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  uc.id === useCase
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">{uc.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {uc.description}
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-mono">
                  Default: {uc.defaultFramework}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-400">Prompt Maker</span> &mdash; The Developer&apos;s Meta-Prompt Assistant
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">⌘ + Enter</kbd> to transform</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-indigo-400 hover:underline"
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
