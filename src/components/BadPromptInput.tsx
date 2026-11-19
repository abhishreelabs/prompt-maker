import React, { useEffect, useRef, useState } from 'react';
import type { UseCaseId, TargetModel, PromptTone } from '../types/index.ts';
import { USE_CASES } from '../data/useCases.ts';
import { MODEL_PRESETS } from '../data/models.ts';
import { analyzeBadPrompt } from '../engine/promptAnalyzer.ts';
import {
  Wand2,
  TestTube2,
  CheckCircle2,
  Bug,
  Wrench,
  Sparkles,
  Network,
  ShieldCheck,
  Database,
  Terminal,
  Code2,
  ArrowRight,
  Layers,
  Lightbulb,
  Plus,
  Cloud,
  Lock,
  Key,
  Stethoscope,
  Palette,
  Zap,
  FolderGit2,
  AlertTriangle,
  FileText
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
  onTransform: () => void;
  isTransforming: boolean;
  onOpenLearned?: () => void;
}

const USE_CASE_ICONS: Record<UseCaseId, React.ReactNode> = {
  'ui-testing': <TestTube2 className="w-3.5 h-3.5 text-emerald-400" />,
  'unit-testing': <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />,
  'bug-fixing': <Bug className="w-3.5 h-3.5 text-rose-400" />,
  'code-refactoring': <Wrench className="w-3.5 h-3.5 text-amber-400" />,
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
  onTransform,
  isTransforming,
  onOpenLearned
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUseCase = USE_CASES.find(u => u.id === useCase) || USE_CASES[0];
  const [activeGroup, setActiveGroup] = useState<'testing' | 'ops' | 'security' | 'apps'>('testing');

  // Groups for clean navigation
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

  // Live prompt linting
  const liveAnalysis = analyzeBadPrompt(rawPrompt, useCase);

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

  const insertVariable = (varName: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = rawPrompt;
    const insertion = `{{${varName}}}`;
    const nextText = text.substring(0, start) + insertion + text.substring(end);
    setRawPrompt(nextText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + insertion.length, start + insertion.length);
      }
    }, 10);
  };

  const lineCount = rawPrompt.split('\n').length;
  const wordCount = rawPrompt.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="craft-chassis rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden border border-white/[0.08]">
      {/* Editor Tab Chrome */}
      <div className="bg-[#0c0e15] px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] text-xs font-mono text-slate-200">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>draft.prompt</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1" />
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Stage 1: Raw Input
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span className="text-rose-400 font-semibold flex items-center space-x-1">
            <span>Score: {liveAnalysis.clarityScore}%</span>
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Domain Group Filter Tabs */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Select Domain:
            </span>
            {onOpenLearned && (
              <button
                type="button"
                onClick={onOpenLearned}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-semibold transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-3 h-3" />
                <span>Learned From Repos &rarr;</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1 border-b border-white/[0.08] pb-1 overflow-x-auto">
            {(Object.keys(groups) as Array<keyof typeof groups>).map(grp => (
              <button
                key={grp}
                type="button"
                onClick={() => setActiveGroup(grp)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeGroup === grp
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {groups[grp].label}
              </button>
            ))}
          </div>

          {/* Sub-items in active group */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2">
            {groups[activeGroup].ids.map(id => {
              const uc = USE_CASES.find(u => u.id === id);
              if (!uc) return null;
              const isSelected = uc.id === useCase;
              return (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => handleUseCaseChange(uc.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-sm'
                      : 'bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/20 hover:text-slate-200'
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
        <div className="bg-black/40 rounded-xl p-2.5 border border-white/[0.06]">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1.5 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Developer Drafts:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentUseCase.sampleBadPrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setRawPrompt(sample.prompt);
                  setFramework(sample.suggestedStack);
                }}
                className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors text-left font-mono"
              >
                &ldquo;{sample.title}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* The Code-Editor Styled Textarea */}
        <div className="flex-1 flex flex-col relative craft-inner-input rounded-xl overflow-hidden min-h-[170px] border border-white/[0.06]">
          <textarea
            ref={textareaRef}
            value={rawPrompt}
            onChange={e => setRawPrompt(e.target.value)}
            placeholder={`Type your raw prompt (e.g. "${currentUseCase.sampleBadPrompts[0]?.prompt || 'test the login form with email & password'}")...`}
            className="w-full flex-1 p-4 bg-transparent text-slate-100 placeholder-slate-600 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed"
          />

          {/* Real-time Linter warning footer */}
          <div className="bg-black/60 px-3 py-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center space-x-2 text-rose-300 font-mono">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>
                {liveAnalysis.missingElements.length} Linter Warnings (AI will guess or flake)
              </span>
            </div>

            {/* Quick variable chips */}
            <div className="flex items-center space-x-1 font-mono">
              <span className="text-slate-500 text-[10px]">Insert:</span>
              {['component', 'url', 'schema'].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVariable(v)}
                  className="px-1.5 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-[10px] border border-white/[0.08]"
                >
                  +{v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">
              Stack / Target:
            </label>
            <input
              type="text"
              value={framework}
              onChange={e => setFramework(e.target.value)}
              placeholder="e.g. Playwright, Next.js"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-slate-200 text-xs focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">
              AI Dialect Wrapper:
            </label>
            <select
              value={targetModel}
              onChange={e => setTargetModel(e.target.value as TargetModel)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-slate-200 text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              {Object.values(MODEL_PRESETS).map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.badge})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">
              Enforcement Rigor:
            </label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as PromptTone)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-slate-200 text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="production">🛡️ Production-Grade (Exhaustive)</option>
              <option value="crisp">⚡ Crisp & Direct (Zero Fluff)</option>
              <option value="step-by-step">🪜 Step-by-Step Architecture</option>
              <option value="qa-adversarial">🔥 QA Adversarial (Stress-Test)</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onTransform}
          disabled={isTransforming || !rawPrompt.trim()}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold shadow-lg shadow-amber-500/20 tactile-btn flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isTransforming ? (
            <>
              <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              <span className="font-display tracking-wide">Compiling Production Meta-Prompt...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span className="font-display tracking-wide text-sm">Harden & Compile AI Prompt</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20 text-black border border-black/20 hidden sm:inline-block">
                ⌘ + Enter
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
