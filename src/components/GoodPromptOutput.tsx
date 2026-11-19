import React, { useState } from 'react';
import { PromptTransformationResult } from '../types';
import { MODEL_PRESETS } from '../data/models';
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
  Cpu
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
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'breakdown'>('formatted');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const handleCopy = () => {
    if (!result) return;
    const finalPrompt = getProcessedPrompt();
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);

    // Confetti celebration
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
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
      <div className="h-full min-h-[450px] bg-slate-900/40 rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 animate-ping" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-200">
            Synthesizing Comprehensive Prompt...
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Analyzing developer context, generating edge-case matrices, enforcing deterministic locators, and structuring output constraints.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full min-h-[450px] bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
          <FileCode className="w-7 h-7 text-slate-500" />
        </div>
        <div className="max-w-md">
          <h3 className="text-base font-semibold text-slate-300">
            Your Elite AI Prompt Will Appear Here
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Enter a rough draft on the left (e.g. &ldquo;test login form&rdquo; or &ldquo;refactor this loop&rdquo;) and click <span className="text-indigo-400 font-medium">Transform</span> to generate an expert prompt with boundary tests, proper roles, and strict schemas.
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
    <div className="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
            <span>Enhanced AI Prompt</span>
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Score: {result.clarityScoreAfter}/100
            </span>
          </h2>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('formatted')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
              activeTab === 'formatted'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
              activeTab === 'raw'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Raw</span>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
              activeTab === 'breakdown'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Breakdown</span>
          </button>
        </div>
      </div>

      {/* Meta Bar: Target Model badge & Engine */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-200">{targetPreset?.name || result.targetModel}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
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
        <div className="bg-indigo-950/20 rounded-xl p-3 border border-indigo-500/20">
          <div className="text-xs font-semibold text-indigo-300 mb-2 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Placeholders Detected:</span>
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
                  className="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative min-h-[300px] overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
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
          <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
            <div className="text-slate-300 font-medium pb-2 border-b border-slate-800">
              Injected Architectural Upgrades:
            </div>
            <div className="space-y-2">
              {result.improvements.map((imp, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-slate-200 leading-normal">{imp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center space-x-2">
          {/* Download as Markdown */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>

          {/* Copy as .cursorrules / system instruction */}
          <button
            type="button"
            onClick={handleCopyAsSystem}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Copy as System Prompt / .cursorrules"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy as .cursorrules</span>
          </button>
        </div>

        {/* Primary Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-emerald-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard! 🎉</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Enhanced Prompt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
