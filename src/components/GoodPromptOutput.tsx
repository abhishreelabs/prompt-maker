import React, { useState } from 'react';
import type { PromptTransformationResult } from '../types/index.ts';
import { MODEL_PRESETS } from '../data/models.ts';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Download,
  Share2,
  FileCode,
  Sparkles,
  Eye,
  Code,
  Sliders,
  CheckCircle,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

interface GoodPromptOutputProps {
  result: PromptTransformationResult | null;
  isTransforming: boolean;
}

export const GoodPromptOutput: React.FC<GoodPromptOutputProps> = ({
  result,
  isTransforming
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'breakdown' | 'diff'>('formatted');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const handleCopy = () => {
    if (!result) return;
    const finalPrompt = getProcessedPrompt();
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#06b6d4', '#ffffff']
      });
    } catch {
      // Fallback
    }

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const finalPrompt = getProcessedPrompt();
    const blob = new Blob([finalPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-${result.useCase}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyAsSystem = () => {
    if (!result) return;
    const finalPrompt = getProcessedPrompt();
    const systemPromptFormat = `// AI System Instruction / .cursorrules\n${finalPrompt}`;
    navigator.clipboard.writeText(systemPromptFormat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVariableChange = (key: string, val: string) => {
    setVariableValues(prev => ({ ...prev, [key]: val }));
  };

  const getProcessedPrompt = () => {
    if (!result) return '';
    let text = result.enhancedPrompt;
    Object.entries(variableValues).forEach(([key, val]) => {
      if (val.trim()) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        text = text.replace(regex, val);
      }
    });
    return text;
  };

  if (isTransforming) {
    return (
      <div className="craft-chassis rounded-2xl flex flex-col items-center justify-center min-h-[460px] p-8 text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Compiling Meta-Prompt Architecture...
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
            Generating edge cases, calculating accessible locators, enforcing auto-wait assertions, and structuring deliverables.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="craft-chassis rounded-2xl flex flex-col items-center justify-center min-h-[460px] p-8 text-center space-y-4 border border-dashed border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/[0.08]">
          <FileCode className="w-7 h-7 text-slate-600" />
        </div>
        <div className="max-w-md">
          <h3 className="font-display text-base font-bold text-slate-200">
            Awaiting Developer Draft
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Enter a task on the left (e.g. &ldquo;test login form&rdquo; or &ldquo;check dns failure&rdquo;) and click <span className="text-amber-400 font-semibold">Harden & Compile</span>.
          </p>
        </div>
      </div>
    );
  }

  const processedText = getProcessedPrompt();
  const wordCount = processedText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = processedText.length;
  const tokenCountEst = Math.round(charCount / 3.8);
  const targetPreset = MODEL_PRESETS[result.targetModel];

  return (
    <div className="craft-chassis rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden border border-white/[0.08]">
      {/* Editor Tab Chrome */}
      <div className="bg-[#0c0e15] px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>compiled.prompt.md</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Score: {result.clarityScoreAfter}/100
          </span>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 bg-black/50 p-0.5 rounded-lg border border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveTab('formatted')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer ${
              activeTab === 'formatted'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer ${
              activeTab === 'raw'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Raw</span>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Injections</span>
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Diff</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">{targetPreset?.name || result.targetModel}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/[0.08]">
              {targetPreset?.badge}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{tokenCountEst} tokens</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <Cpu className="w-3 h-3" />
              <span>{result.engineUsed === 'offline-smart-template' ? 'Offline Engine' : 'AI Powered'}</span>
            </span>
          </div>
        </div>

        {/* Variable Replacer if variables found */}
        {result.detectedVariables.length > 0 && (
          <div className="bg-amber-950/20 rounded-xl p-3 border border-amber-500/20">
            <div className="text-xs font-semibold text-amber-300 mb-2 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Variables Detected:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.detectedVariables.map(v => (
                <div key={v.key} className="flex items-center space-x-2 text-xs">
                  <span className="font-mono text-slate-400 font-semibold">{`{{${v.key}}}`}:</span>
                  <input
                    type="text"
                    placeholder={`Value for ${v.key}`}
                    value={variableValues[v.key] || ''}
                    onChange={e => handleVariableChange(v.key, e.target.value)}
                    className="flex-1 px-2 py-1 rounded bg-black/50 border border-white/[0.08] text-slate-200 text-xs focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Viewer */}
        <div className="flex-1 relative craft-inner-input rounded-xl overflow-hidden min-h-[300px] border border-white/[0.06] flex flex-col">
          {activeTab === 'formatted' && (
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
              {processedText}
            </div>
          )}

          {activeTab === 'raw' && (
            <textarea
              readOnly
              value={processedText}
              className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-xs sm:text-sm resize-none focus:outline-none"
            />
          )}

          {activeTab === 'breakdown' && (
            <div className="p-4 overflow-y-auto flex-1 space-y-2.5 text-xs">
              <div className="text-slate-300 font-semibold pb-2 border-b border-white/[0.08]">
                Injected Architectural Upgrades:
              </div>
              <div className="space-y-2">
                {result.improvements.map((imp, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 bg-black/40 p-3 rounded-xl border border-white/[0.06]">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-200 leading-relaxed">{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diff' && (
            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs font-mono">
              <div className="bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">Original Draft:</span>
                <span className="text-slate-300 line-through opacity-80">{result.originalPrompt}</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
                <span className="text-emerald-400 font-bold block mb-1">Hardened Output (+{(processedText.length - result.originalPrompt.length)} chars):</span>
                <span className="text-emerald-200/90">{processedText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAsSystem}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy .cursorrules</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg tactile-btn cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                : 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied! 🎉</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Hardened Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
