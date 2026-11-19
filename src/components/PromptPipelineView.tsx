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
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
      description: 'Parsed raw text for keywords, framework clues, and identified 4 missing architectural safeguards.',
      status: 'Clarity: ' + result.clarityScoreBefore + '%'
    },
    {
      step: '02',
      title: 'Persona Synthesis',
      badge: 'Role Layer',
      icon: <Shield className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300',
      description: 'Assigned Principal Engineer role to enforce production standards and prohibit placeholder code.',
      status: 'Domain: ' + result.useCase
    },
    {
      step: '03',
      title: 'Defensive Scenario Injection',
      badge: 'Resilience Matrix',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
      description: 'Injected negative tests, 500 error stubs, network latency loading states, and mobile touch targets.',
      status: result.improvements.length + ' Safeguards Added'
    },
    {
      step: '04',
      title: 'Anti-Pattern Guardrails',
      badge: 'Deterministic Rules',
      icon: <Sliders className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
      description: 'Banned arbitrary sleep(3000), banned brittle selectors (div > span:nth-child), enforced auto-waits.',
      status: 'Zero-Flake Rules'
    },
    {
      step: '05',
      title: 'Model Dialect Wrapping',
      badge: 'Target Assembly',
      icon: <FileCode2 className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
      description: `Structured with ${result.targetModel.toUpperCase()} syntax (XML tags, headers, and explicit deliverable format).`,
      status: 'Score: ' + result.clarityScoreAfter + '%'
    }
  ];

  return (
    <div className="craft-chassis rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white tracking-wide">
              Compiler Pipeline Visualizer
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
              Live Flow
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            See how your raw one-liner moves through 5 transformation nodes into a bulletproof production prompt.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.08]">
            Input: <span className="text-amber-400 font-bold">{result.clarityScoreBefore}%</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.08]">
            Output: <span className="text-emerald-400 font-bold">{result.clarityScoreAfter}%</span>
          </span>
        </div>
      </div>

      {/* Pipeline Nodes Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => (
          <div
            key={stage.step}
            className={`p-4 rounded-xl border ${stage.color} relative flex flex-col justify-between space-y-3 shadow-lg`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-slate-400 opacity-60">
                {stage.step}
              </span>
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/[0.06]">
                {stage.icon}
              </div>
            </div>

            {/* Title & Badge */}
            <div>
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-black/40 border border-white/[0.06] mb-1 font-semibold">
                {stage.badge}
              </span>
              <h4 className="font-semibold text-xs text-white leading-snug">
                {stage.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {stage.description}
            </p>

            {/* Status footer */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Passed</span>
              </span>
              <span className="font-semibold text-slate-200">{stage.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
