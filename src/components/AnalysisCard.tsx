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
    <div className="craft-chassis rounded-2xl p-6 sm:p-7 space-y-6 border border-slate-200 dark:border-white/[0.08]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2.5">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white tracking-wide">
              Architectural Audit: Why Your Prompt Was Vulnerable
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans">
            Compare why standard AI hallucinates or flakes on the draft vs how Prompt Maker locks down the constraints.
          </p>
        </div>

        {/* Score comparison pill */}
        <div className="flex items-center space-x-3.5 bg-slate-100 dark:bg-black/60 px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] self-start sm:self-auto">
          <div className="text-center font-mono">
            <span className="block text-xs uppercase font-outfit text-rose-600 dark:text-rose-400 font-bold tracking-wider">Raw Draft</span>
            <span className="text-lg sm:text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {result.clarityScoreBefore}%
            </span>
          </div>
          <ArrowRight className="w-4.5 h-4.5 text-slate-400 dark:text-slate-600" />
          <div className="text-center font-mono">
            <span className="block text-xs uppercase font-outfit text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">Hardened</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {result.clarityScoreAfter}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Left: What Was Missing / Vulnerabilities */}
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/25 rounded-xl p-5 space-y-3.5">
          <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-outfit font-bold text-sm tracking-wider uppercase">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
            <span>Defects Found in Raw Draft</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            When developers send unconstrained prompts to LLMs, the model defaults to fragile CSS locators, missing negative tests, and arbitrary sleep timers.
          </p>
          <ul className="space-y-2.5">
            {analysis.missingElements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-rose-950 dark:text-rose-200 font-mono text-xs sm:text-[13px] leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
            {analysis.missingElements.length === 0 && (
              <li className="text-slate-500 dark:text-slate-400 italic text-sm">No critical defects found in draft.</li>
            )}
          </ul>
        </div>

        {/* Right: What Prompt Maker Injected */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/25 rounded-xl p-5 space-y-3.5">
          <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-outfit font-bold text-sm tracking-wider uppercase">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>Safeguards & Invariants Injected</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            The hardened output directs the AI with defensive validation, accessible roles, auto-wait assertions, and complete failure scenarios.
          </p>
          <ul className="space-y-2.5">
            {result.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-emerald-950 dark:text-emerald-200 font-mono text-xs sm:text-[13px] leading-relaxed">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
