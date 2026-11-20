import React from 'react';
import { PromptTransformationResult } from '../types/index.ts';
import {
  Cpu,
  Shield,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileCode2,
  Sparkles
} from 'lucide-react';

interface PromptPipelineViewProps {
  result: PromptTransformationResult;
}

export const PromptPipelineView: React.FC<PromptPipelineViewProps> = ({ result }) => {
  const stages = [
    {
      step: '01',
      title: 'Intent Parsing & Linter',
      badge: 'Analysis Pass',
      icon: <Cpu className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />,
      color: 'border-cyan-300 bg-cyan-50/70 text-cyan-950 dark:border-cyan-500/30 dark:bg-cyan-950/20 dark:text-cyan-300',
      description: 'Parsed raw text for keywords, framework clues, and identified missing architectural safeguards.',
      status: 'Clarity: ' + result.clarityScoreBefore + '%'
    },
    {
      step: '02',
      title: 'Persona Synthesis',
      badge: 'Role Layer',
      icon: <Shield className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />,
      color: 'border-indigo-300 bg-indigo-50/70 text-indigo-950 dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-300',
      description: 'Assigned Principal Engineer role to enforce production standards and prohibit placeholder code.',
      status: 'Domain: ' + result.useCase
    },
    {
      step: '03',
      title: 'Defensive Scenario Injection',
      badge: 'Resilience Matrix',
      icon: <Layers className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-300 bg-amber-50/70 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-300',
      description: 'Injected negative tests, 500 error stubs, network latency loading states, and mobile touch targets.',
      status: result.improvements.length + ' Safeguards Added'
    },
    {
      step: '04',
      title: 'Anti-Pattern Guardrails',
      badge: 'Deterministic Rules',
      icon: <Sliders className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />,
      color: 'border-rose-300 bg-rose-50/70 text-rose-950 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-300',
      description: 'Banned arbitrary sleep(3000), banned brittle selectors (div > span:nth-child), enforced auto-waits.',
      status: 'Zero-Flake Rules'
    },
    {
      step: '05',
      title: 'Model Dialect Wrapping',
      badge: 'Target Assembly',
      icon: <FileCode2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />,
      color: 'border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-300',
      description: `Structured with ${result.targetModel.toUpperCase()} syntax (XML tags, headers, and explicit deliverable format).`,
      status: 'Score: ' + result.clarityScoreAfter + '%'
    }
  ];

  return (
    <div className="craft-chassis rounded-2xl p-4 sm:p-7 space-y-5 sm:space-y-6 border border-slate-200 dark:border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <h3 className="font-outfit font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-wide">
              Compiler Pipeline Visualizer
            </h3>
            <span className="text-xs font-outfit px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-semibold shrink-0">
              Live Flow
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans leading-relaxed">
            See how your raw one-liner moves through 5 transformation nodes into a bulletproof production prompt.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 self-start sm:self-auto shrink-0">
          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08]">
            Input: <span className="text-amber-600 dark:text-amber-400 font-bold">{result.clarityScoreBefore}%</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08]">
            Output: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{result.clarityScoreAfter}%</span>
          </span>
        </div>
      </div>

      {/* Pipeline Nodes Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
        {stages.map((stage) => (
          <div
            key={stage.step}
            className={`p-4.5 rounded-xl border ${stage.color} relative flex flex-col justify-between space-y-3.5 shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-extrabold text-slate-500 dark:text-slate-400 opacity-80">
                {stage.step}
              </span>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-black/30 border border-black/10 dark:border-white/[0.06]">
                {stage.icon}
              </div>
            </div>

            {/* Title & Badge */}
            <div className="space-y-1">
              <span className="inline-block text-xs font-outfit uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/[0.06] font-bold text-slate-800 dark:text-slate-200">
                {stage.badge}
              </span>
              <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {stage.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {stage.description}
            </p>

            {/* Status footer */}
            <div className="pt-2.5 border-t border-black/10 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 gap-1.5">
              <span className="flex items-center space-x-1 font-medium shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Passed</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-xs text-right" title={stage.status}>
                {stage.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
