import React from 'react';
import type { PromptTransformationResult } from '../types/index.ts';
import { analyzeBadPrompt } from '../engine/promptAnalyzer.ts';
import { AlertTriangle, CheckCircle, ArrowRight, ShieldAlert, Activity } from 'lucide-react';

interface AnalysisCardProps {
  result: PromptTransformationResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result }) => {
  const analysis = analyzeBadPrompt(result.originalPrompt, result.useCase);

  return (
    <div className="craft-chassis rounded-2xl p-6 space-y-6 border border-white/[0.08]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-base text-white tracking-wide">
              Architectural Audit: Why Your Prompt Was Vulnerable
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare why standard AI hallucinates or flakes on the draft vs how Prompt Maker locks down the constraints.
          </p>
        </div>

        {/* Score comparison pill */}
        <div className="flex items-center space-x-3 bg-black/60 px-4 py-2 rounded-xl border border-white/[0.08] self-start sm:self-auto">
          <div className="text-center font-mono">
            <span className="block text-[10px] uppercase text-rose-400 font-semibold tracking-wider">Raw Draft</span>
            <span className="text-base font-extrabold text-rose-400">
              {result.clarityScoreBefore}%
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <div className="text-center font-mono">
            <span className="block text-[10px] uppercase text-emerald-400 font-semibold tracking-wider">Hardened</span>
            <span className="text-base font-extrabold text-emerald-400">
              {result.clarityScoreAfter}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: What Was Missing / Vulnerabilities */}
        <div className="bg-rose-950/15 border border-rose-500/20 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center space-x-2 text-rose-300 font-mono font-bold text-xs tracking-wide uppercase">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Defects Found in Raw Draft</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            When developers send unconstrained prompts to LLMs, the model defaults to fragile CSS locators, missing negative tests, and arbitrary sleep timers.
          </p>
          <ul className="space-y-2 text-xs">
            {analysis.missingElements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-rose-200/90 font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
            {analysis.missingElements.length === 0 && (
              <li className="text-slate-400 italic">No critical defects found in draft.</li>
            )}
          </ul>
        </div>

        {/* Right: What Prompt Maker Injected */}
        <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-300 font-mono font-bold text-xs tracking-wide uppercase">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Safeguards & Invariants Injected</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The hardened output directs the AI with defensive validation, accessible roles, auto-wait assertions, and complete failure scenarios.
          </p>
          <ul className="space-y-2 text-xs">
            {result.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-emerald-200/90 font-mono text-[11px]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
