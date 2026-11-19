import React from 'react';
import { PromptTransformationResult } from '../types';
import { analyzeBadPrompt } from '../engine/promptAnalyzer';
import { AlertTriangle, CheckCircle, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

interface AnalysisCardProps {
  result: PromptTransformationResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result }) => {
  const analysis = analyzeBadPrompt(result.originalPrompt, result.useCase);

  return (
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Prompt Engineering Audit: Why This Rewriting Works</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare the technical vulnerabilities in the raw draft against the hardened production prompt.
          </p>
        </div>

        {/* Score comparison pill */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
          <div className="text-center">
            <span className="block text-[10px] uppercase text-rose-400 font-semibold">Raw Score</span>
            <span className="text-base font-extrabold text-rose-400 font-mono">
              {result.clarityScoreBefore}%
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <div className="text-center">
            <span className="block text-[10px] uppercase text-emerald-400 font-semibold">Hardened</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {result.clarityScoreAfter}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: What Was Missing / Vulnerabilities */}
        <div className="bg-rose-950/10 border border-rose-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-rose-300 font-semibold text-xs tracking-wide uppercase">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Common Vulnerabilities in Your Draft</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            When developers pass unconstrained prompts to AI, LLMs tend to generate fragile code, guess architecture, or introduce flaky tests.
          </p>
          <ul className="space-y-2 text-xs">
            {analysis.missingElements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-rose-200/90">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
            {analysis.missingElements.length === 0 && (
              <li className="text-slate-400 italic">No major vulnerabilities detected in draft.</li>
            )}
          </ul>
        </div>

        {/* Right: What Prompt Maker Injected */}
        <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-xs tracking-wide uppercase">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Safeguards & Architectures Injected</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The enhanced prompt forces the AI into a strict domain expert persona with anti-hallucination rules and rigorous verification criteria.
          </p>
          <ul className="space-y-2 text-xs">
            {result.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-emerald-200/90">
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
