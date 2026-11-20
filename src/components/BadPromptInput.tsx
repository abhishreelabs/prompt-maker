import React, { useEffect, useRef, useState } from 'react';
import type { UseCaseId, TargetModel, PromptTone } from '../types/index.ts';
import { USE_CASES } from '../data/useCases.ts';
import { MODEL_PRESETS } from '../data/models.ts';
import { analyzeBadPrompt } from '../engine/promptAnalyzer.ts';
import { scrubSecrets } from '../engine/secretScrubber.ts';
import {
  FileText,
  Lightbulb,
  Check,
  CheckCircle2,
  Trash2,
  Play,
  Maximize2,
  Minimize2,
  FolderGit2,
  SlidersHorizontal,
  PenTool,
  CheckCircle,
  Bug,
  Key,
  ShieldCheck,
  Database,
  Terminal,
  Cloud,
  Lock,
  Stethoscope,
  Palette,
  Zap,
  Code2,
  Network,
  Sparkles
} from 'lucide-react';

interface BadPromptInputProps {
  rawPrompt: string;
  setRawPrompt: (val: string) => void;
  useCase: UseCaseId;
  setUseCase: (val: UseCaseId) => void;
  framework: string;
  setFramework: (val: string) => void;
  targetModel: TargetModel;
  setTargetModel: (val: TargetModel) => void;
  tone: PromptTone;
  setTone: (val: PromptTone) => void;
  projectContext?: string;
  setProjectContext?: (val: string) => void;
  onTransform: () => void;
  isTransforming: boolean;
  onOpenLearned?: () => void;
}

const USE_CASE_ICONS: Record<UseCaseId, React.ReactNode> = {
  'ui-testing': <PenTool className="w-3.5 h-3.5 text-cyan-400" />,
  'unit-testing': <CheckCircle className="w-3.5 h-3.5 text-blue-400" />,
  'bug-fixing': <Bug className="w-3.5 h-3.5 text-rose-400" />,
  'code-refactoring': <Key className="w-3.5 h-3.5 text-amber-400" />,
  'feature-implementation': <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
  'api-design': <Network className="w-3.5 h-3.5 text-cyan-400" />,
  'code-review': <ShieldCheck className="w-3.5 h-3.5 text-red-400" />,
  'db-optimization': <Database className="w-3.5 h-3.5 text-orange-400" />,
  'devops-docker': <Terminal className="w-3.5 h-3.5 text-teal-400" />,
  'devops-infra': <Cloud className="w-3.5 h-3.5 text-sky-400" />,
  'security-privacy': <Lock className="w-3.5 h-3.5 text-emerald-400" />,
  'secrets-observability': <Key className="w-3.5 h-3.5 text-amber-400" />,
  'healthcare-doctor': <Stethoscope className="w-3.5 h-3.5 text-rose-400" />,
  'image-generation': <Palette className="w-3.5 h-3.5 text-fuchsia-400" />,
  'concurrency-scaling': <Zap className="w-3.5 h-3.5 text-yellow-400" />,
  'general-developer': <Code2 className="w-3.5 h-3.5 text-slate-400" />
};

export const BadPromptInput: React.FC<BadPromptInputProps> = ({
  rawPrompt,
  setRawPrompt,
  useCase,
  setUseCase,
  framework,
  setFramework,
  targetModel,
  setTargetModel,
  tone,
  setTone,
  projectContext = '',
  setProjectContext,
  onTransform,
  isTransforming,
  onOpenLearned
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUseCase = USE_CASES.find(u => u.id === useCase) || USE_CASES[0];
  const [activeGroup, setActiveGroup] = useState<'testing' | 'ops' | 'security' | 'apps'>('testing');
  const [showConfig, setShowConfig] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Groups matching the mockup
  const groups: Record<'testing' | 'ops' | 'security' | 'apps', { label: string; ids: UseCaseId[] }> = {
    testing: {
      label: 'Testing & QA',
      ids: ['ui-testing', 'unit-testing', 'bug-fixing', 'code-refactoring']
    },
    ops: {
      label: 'Cloud & Ops',
      ids: ['devops-infra', 'devops-docker', 'secrets-observability', 'db-optimization']
    },
    security: {
      label: 'Security & Core',
      ids: ['security-privacy', 'concurrency-scaling', 'code-review', 'general-developer']
    },
    apps: {
      label: 'Domains & Features',
      ids: ['healthcare-doctor', 'image-generation', 'feature-implementation', 'api-design']
    }
  };

  const liveAnalysis = analyzeBadPrompt(rawPrompt, useCase);
  const liveSecrets = scrubSecrets(rawPrompt);

  const handleUseCaseChange = (id: UseCaseId) => {
    setUseCase(id);
    const def = USE_CASES.find(u => u.id === id);
    if (def) {
      setFramework(def.defaultFramework);
    }
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (rawPrompt.trim() && !isTransforming) {
          e.preventDefault();
          onTransform();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rawPrompt, isTransforming, onTransform]);

  const lineCount = rawPrompt.split('\n').length;
  const wordCount = rawPrompt.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className={`craft-chassis rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] ${
      isFullscreen ? 'fixed inset-4 z-50 bg-white dark:bg-[#0c0f1a]' : ''
    }`}>
      {/* Editor Tab Chrome */}
      <div className="bg-slate-100 dark:bg-[#0c0e15] px-4 py-2.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-800 dark:text-slate-200 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>draft.prompt</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-1" />
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Stage 1: Raw Input
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span className="text-rose-500 dark:text-rose-400 font-semibold">
            Score: {liveAnalysis.clarityScore}%
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Domain Group Filter Tabs */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-outfit uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              SELECT DOMAIN *
            </span>
            {onOpenLearned && (
              <button
                type="button"
                onClick={onOpenLearned}
                className="text-xs font-outfit text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center space-x-1 font-semibold transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Curated Blueprints &rarr;</span>
              </button>
            )}
          </div>

          {/* 4 Group tabs with checkmark on active */}
          <div className="flex items-center space-x-1.5 pb-2 overflow-x-auto text-xs sm:text-sm">
            {(Object.keys(groups) as Array<keyof typeof groups>).map(grp => {
              const isActive = activeGroup === grp;
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setActiveGroup(grp)}
                  className={`px-3.5 py-1.5 rounded-lg font-outfit text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'border border-amber-500/80 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{groups[grp].label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-items in active group */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {groups[activeGroup].ids.map(id => {
              const uc = USE_CASES.find(u => u.id === id);
              if (!uc) return null;
              const isSelected = uc.id === useCase;
              return (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => handleUseCaseChange(uc.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-outfit transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border border-cyan-400/80 bg-cyan-950/20 text-cyan-800 dark:text-cyan-200 shadow-sm shadow-cyan-500/20 font-bold'
                      : 'bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {USE_CASE_ICONS[uc.id]}
                  <span className="truncate">{uc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Inspo Chips */}
        <div className="bg-slate-50 dark:bg-black/40 rounded-xl p-3 border border-slate-200 dark:border-white/[0.06]">
          <div className="flex items-center space-x-1.5 text-xs font-outfit text-slate-600 dark:text-slate-400 mb-1.5 font-bold">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Sample Developer Drafts:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUseCase.sampleBadPrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setRawPrompt(sample.prompt);
                  setFramework(sample.suggestedStack);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-slate-900 dark:hover:text-white transition-colors text-left font-mono"
              >
                &ldquo;{sample.title}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Token Guardrail Alert */}
        {liveSecrets.hasSecrets && (
          <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono animate-in fade-in duration-150 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">🛡️ Pre-Flight Guardrail Active:</span> Detected {liveSecrets.totalCount} sensitive credential(s) ({liveSecrets.detectedSecrets.map(s => s.type).join(', ')}). They will be automatically redacted before processing.
            </div>
          </div>
        )}

        {/* Code-Editor Styled Textarea with Line Numbers and Fullscreen */}
        <div className="h-[180px] flex flex-col relative craft-inner-input rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.06]">
          {/* Top header row inside editor */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white/80 dark:bg-black/50 text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex flex-1">
            {/* Gutter with Line Numbers */}
            <div className="w-10 py-4 select-none font-mono text-xs sm:text-sm text-slate-400 dark:text-slate-600 text-right pr-3 border-r border-slate-200 dark:border-white/[0.06] bg-slate-100/50 dark:bg-black/20">
              {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={rawPrompt}
              onChange={e => setRawPrompt(e.target.value)}
              placeholder={`Type your raw prompt (e.g. "${currentUseCase.sampleBadPrompts[0]?.prompt || 'test the login form with email & password'}")...`}
              className="flex-1 p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 font-mono text-sm sm:text-[15px] resize-none focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Optional Dialect & Options Drawer Toggle */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center space-x-1.5 text-xs font-outfit font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Options: {targetModel.toUpperCase()} &bull; {framework || 'Default Stack'}</span>
          </button>
        </div>

        {/* Collapsible Config Row */}
        {showConfig && (
          <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.06] text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold mb-1.5">
                  Target Framework:
                </label>
                <input
                  type="text"
                  value={framework}
                  onChange={e => setFramework(e.target.value)}
                  placeholder="e.g. Playwright, Next.js"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/50 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold mb-1.5">
                  Model Dialect:
                </label>
                <select
                  value={targetModel}
                  onChange={e => setTargetModel(e.target.value as TargetModel)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/50 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  {Object.values(MODEL_PRESETS).map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold mb-1.5">
                  Rigor Tone:
                </label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as PromptTone)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/50 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="production">🛡️ Production-Grade (Exhaustive)</option>
                  <option value="crisp">⚡ Crisp & Direct</option>
                  <option value="step-by-step">🪜 Step-by-Step Architecture</option>
                  <option value="qa-adversarial">🔥 QA Adversarial</option>
                </select>
              </div>
            </div>

            {/* Target Project Workspace Context (Tailors instructions to this specific repository) */}
            {setProjectContext && (
              <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
                    Target Project Context (Workspace Tech Stack & Architecture):
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                    Forces AI to align with your exact project files
                  </span>
                </div>
                <input
                  type="text"
                  value={projectContext}
                  onChange={e => setProjectContext(e.target.value)}
                  placeholder="e.g. Next.js 16 + TypeScript + Tailwind CSS + PostgreSQL"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/50 border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Bar matching Image 1 & 2 */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Auto-saved indicator */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Auto-saved 1s ago</span>
          </div>

          {/* Right: Clear and Compile buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setRawPrompt('')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-outfit font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={onTransform}
              disabled={isTransforming || !rawPrompt.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-outfit font-bold text-xs shadow-lg shadow-indigo-600/30 tactile-btn transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransforming ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Compile Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
