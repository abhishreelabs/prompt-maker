import React, { useEffect, useRef } from 'react';
import { UseCaseId, TargetModel, PromptTone } from '../types';
import { USE_CASES } from '../data/useCases';
import { MODEL_PRESETS } from '../data/models';
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
  Plus
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
}

const USE_CASE_ICONS: Record<UseCaseId, React.ReactNode> = {
  'ui-testing': <TestTube2 className="w-4 h-4 text-emerald-400" />,
  'unit-testing': <CheckCircle2 className="w-4 h-4 text-blue-400" />,
  'bug-fixing': <Bug className="w-4 h-4 text-rose-400" />,
  'code-refactoring': <Wrench className="w-4 h-4 text-amber-400" />,
  'feature-implementation': <Sparkles className="w-4 h-4 text-purple-400" />,
  'api-design': <Network className="w-4 h-4 text-cyan-400" />,
  'code-review': <ShieldCheck className="w-4 h-4 text-red-400" />,
  'db-optimization': <Database className="w-4 h-4 text-orange-400" />,
  'devops-docker': <Terminal className="w-4 h-4 text-teal-400" />,
  'general-developer': <Code2 className="w-4 h-4 text-slate-400" />
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
  isTransforming
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUseCase = USE_CASES.find(u => u.id === useCase) || USE_CASES[0];

  // Auto-fill default framework when use-case changes if empty
  const handleUseCaseChange = (id: UseCaseId) => {
    setUseCase(id);
    const def = USE_CASES.find(u => u.id === id);
    if (def) {
      setFramework(def.defaultFramework);
    }
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to trigger transform
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

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Raw Developer Input (Your Draft)
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {rawPrompt.trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* Select Use Case */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Target Use Case:</span>
          <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
            {currentUseCase.name}
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {USE_CASES.map(uc => {
            const isSelected = uc.id === useCase;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => handleUseCaseChange(uc.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {USE_CASE_ICONS[uc.id]}
                <span className="truncate">{uc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Inspo Samples */}
      <div className="bg-slate-950/40 rounded-xl p-2.5 border border-slate-800/60">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1.5 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Bad Prompt Inspo:</span>
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
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white transition-colors text-left"
            >
              &ldquo;{sample.title}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Textarea for Raw Prompt */}
      <div className="flex-1 flex flex-col relative min-h-[160px]">
        <textarea
          ref={textareaRef}
          value={rawPrompt}
          onChange={e => setRawPrompt(e.target.value)}
          placeholder={`Type what you would normally say to AI (e.g. "${currentUseCase.sampleBadPrompts[0]?.prompt || 'test the login form with email & password'}")...`}
          className="w-full flex-1 p-4 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-sm font-mono resize-none transition-colors"
        />

        {/* Variables quick chips */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs py-0.5">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Placeholders:</span>
            {['component', 'url', 'endpoint', 'schema', 'framework'].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => insertVariable(v)}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] bg-slate-800/70 hover:bg-slate-700 text-slate-300 border border-slate-700/60 font-mono transition-colors"
                title={`Insert {{${v}}}`}
              >
                <Plus className="w-2.5 h-2.5 mr-0.5 text-indigo-400" />
                {v}
              </button>
            ))}
          </div>
          {rawPrompt && (
            <button
              type="button"
              onClick={() => setRawPrompt('')}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Additional Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800/60 text-xs">
        {/* Framework / Tech Stack */}
        <div>
          <label className="block text-slate-400 font-medium mb-1 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tech Stack / Framework:</span>
          </label>
          <input
            type="text"
            value={framework}
            onChange={e => setFramework(e.target.value)}
            placeholder="e.g. Playwright, Next.js, Jest"
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Target AI Model */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">Target AI Model:</label>
          <select
            value={targetModel}
            onChange={e => setTargetModel(e.target.value as TargetModel)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            {Object.values(MODEL_PRESETS).map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.badge})
              </option>
            ))}
          </select>
        </div>

        {/* Output Tone */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">Prompt Tone:</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value as PromptTone)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="production">🛡️ Production-Grade (Comprehensive)</option>
            <option value="crisp">⚡ Crisp & Direct (Zero Fluff)</option>
            <option value="step-by-step">🪜 Step-by-Step Tutorial</option>
            <option value="qa-adversarial">🔥 QA Adversarial (Break the Code)</option>
          </select>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        type="button"
        onClick={onTransform}
        disabled={isTransforming || !rawPrompt.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
      >
        {isTransforming ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Architecting Elite AI Prompt...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span className="text-sm">Transform to Elite AI Prompt</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/25 text-indigo-200 border border-white/10 hidden sm:inline-block">
              ⌘ + Enter
            </span>
            <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};
