import React, { useState } from 'react';
import type { PromptTransformationResult } from '../types/index.ts';
import { analyzeBadPrompt } from '../engine/promptAnalyzer.ts';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Activity,
  Zap,
  Terminal,
  ShieldCheck,
  XCircle,
  Layers
} from 'lucide-react';

interface AnalysisCardProps {
  result: PromptTransformationResult;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'defects'>('simulation');
  const analysis = analyzeBadPrompt(result.originalPrompt, result.useCase);
  const forecast = result.executionForecast;

  return (
    <div className="craft-chassis rounded-2xl p-6 sm:p-7 space-y-6 border border-slate-200 dark:border-white/[0.08]">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2.5">
            <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white tracking-wide">
              Agent Execution Forecast: What Will Happen to Your Codebase
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-sans">
            A single score doesn't tell the whole story. See the concrete behavioral simulation of how an AI coding agent acts with and without this prompt.
          </p>
        </div>

        {/* Score comparison pill */}
        <div className="flex items-center space-x-3.5 bg-slate-100 dark:bg-black/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] self-start sm:self-auto shrink-0">
          <div className="text-center font-mono">
            <span className="block text-[11px] uppercase font-outfit text-rose-600 dark:text-rose-400 font-bold tracking-wider">Raw Draft</span>
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
              {result.clarityScoreBefore}%
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
          <div className="text-center font-mono">
            <span className="block text-[11px] uppercase font-outfit text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">Hardened</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {result.clarityScoreAfter}%
            </span>
          </div>
        </div>
      </div>

      {/* Target Project Context Badge (if project specific) */}
      {result.projectContext && (
        <div className="flex items-center space-x-2.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/25 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono text-indigo-900 dark:text-indigo-200">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong className="font-outfit font-semibold text-indigo-950 dark:text-indigo-100">Project Context:</strong> {result.projectContext}
          </span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/[0.06] w-fit">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-outfit tracking-wide transition-all cursor-pointer ${
            activeTab === 'simulation'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Execution Simulation (Before vs After)</span>
        </button>
        <button
          onClick={() => setActiveTab('defects')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-outfit tracking-wide transition-all cursor-pointer ${
            activeTab === 'defects'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Defects & Injected Invariants</span>
        </button>
      </div>

      {activeTab === 'simulation' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Left: What Happens Without Hardening */}
          <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/25 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-outfit font-bold text-sm tracking-wider uppercase">
                <XCircle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
                <span>If Sent as Raw Draft</span>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-200/60 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200">
                High Failure Risk
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              {forecast?.withoutHardening.behavior || 'Agent acts as a conversational chatbot, guessing project architecture without reviewing existing interfaces.'}
            </p>

            <div className="space-y-2">
              <span className="block text-xs font-outfit uppercase font-bold text-rose-700 dark:text-rose-400 tracking-wider">
                Predicted Agent Mistakes:
              </span>
              <ul className="space-y-2">
                {(forecast?.withoutHardening.likelyPitfalls || [
                  'Emits lazy stubs (e.g. "// TODO: implement logic here")',
                  'Guesses architecture without validating against actual project conventions',
                  'Omits boundary tests, leading to silent runtime crashes on edge cases',
                  'No automated test verification commands run to guarantee regression safety'
                ]).map((pitfall, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-rose-950 dark:text-rose-200 font-mono text-xs leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-rose-200 dark:border-rose-500/20 text-xs font-sans text-rose-900 dark:text-rose-300">
              <strong>Outcome:</strong> {forecast?.withoutHardening.expectedOutcome || 'Broken code requiring multiple rounds of prompt correction.'}
            </div>
          </div>

          {/* Right: What Happens With Prompt Maker */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/25 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-outfit font-bold text-sm tracking-wider uppercase">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                <span>When Sent With Prompt Maker</span>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                Zero-Stub Enforced
              </span>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-outfit uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                Agent Action Plan Sequence:
              </span>
              <ol className="space-y-2">
                {(forecast?.withHardening.agentActionPlan || [
                  'Context Alignment: Inspects and aligns with target project architecture',
                  'Zero-Stub Code Generation: Writes 100% complete, runnable implementation',
                  'Defensive Boundary Enforcement: Wraps inputs with schema validation',
                  'Automated Verification: Executes test & build commands'
                ]).map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-emerald-950 dark:text-emerald-200 font-mono text-xs leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Verification Commands Preview */}
            {forecast?.withHardening.verificationCommands && forecast.withHardening.verificationCommands.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-emerald-200 dark:border-emerald-500/20">
                <div className="flex items-center space-x-1.5 text-xs font-outfit font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Agent Verification Commands:</span>
                </div>
                <div className="bg-slate-900 dark:bg-black/70 rounded-lg p-2.5 font-mono text-[11px] text-emerald-300 space-y-1">
                  {forecast.withHardening.verificationCommands.slice(0, 3).map((cmd, idx) => (
                    <div key={idx} className={cmd.startsWith('#') ? 'text-slate-500' : 'text-emerald-300'}>
                      {cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-500/20 text-xs font-sans text-emerald-900 dark:text-emerald-300">
              <strong>Outcome:</strong> {forecast?.withHardening.expectedOutcome || 'Production-ready, directly mergeable code.'}
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};
