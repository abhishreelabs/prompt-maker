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
  FileCheck,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { sendTelemetry } from '../engine/telemetry.ts';

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
  const [feedbackStatus, setFeedbackStatus] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = (type: 'positive' | 'negative') => {
    if (!result || feedbackStatus) return;
    setFeedbackStatus(type);
    const finalPrompt = getProcessedPrompt();
    sendTelemetry({
      domain: result.useCase,
      targetFramework: result.framework,
      targetModel: result.targetModel,
      clarityBefore: result.analysis.clarityScoreBefore,
      clarityAfter: result.analysis.clarityScoreAfter,
      defectsDetected: result.analysis.defectsIdentified.map(d => d.type),
      invariantsInjected: result.analysis.invariantsInjected,
      secretsScrubbedCount: result.analysis.secretsScrubbedCount || 0,
      wordCount: finalPrompt.split(/\s+/).filter(Boolean).length,
      userAction: type === 'positive' ? 'feedback_positive' : 'feedback_negative',
      generationMode: result.engineUsed === 'offline-smart-template' ? 'offline_heuristic' : 'ai_gemini'
    });
  };

  const handleCopy = () => {
    if (!result) return;
    const finalPrompt = getProcessedPrompt();
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);

    sendTelemetry({
      domain: result.useCase,
      targetFramework: result.framework,
      targetModel: result.targetModel,
      clarityBefore: result.analysis.clarityScoreBefore,
      clarityAfter: result.analysis.clarityScoreAfter,
      defectsDetected: result.analysis.defectsIdentified.map(d => d.type),
      invariantsInjected: result.analysis.invariantsInjected,
      secretsScrubbedCount: result.analysis.secretsScrubbedCount || 0,
      wordCount: finalPrompt.split(/\s+/).filter(Boolean).length,
      userAction: 'copy',
      generationMode: result.engineUsed === 'offline-smart-template' ? 'offline_heuristic' : 'ai_gemini'
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#ffffff']
      });
    } catch {
      // Fallback
    }

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const finalPrompt = getProcessedPrompt();

    sendTelemetry({
      domain: result.useCase,
      targetFramework: result.framework,
      targetModel: result.targetModel,
      clarityBefore: result.analysis.clarityScoreBefore,
      clarityAfter: result.analysis.clarityScoreAfter,
      defectsDetected: result.analysis.defectsIdentified.map(d => d.type),
      invariantsInjected: result.analysis.invariantsInjected,
      secretsScrubbedCount: result.analysis.secretsScrubbedCount || 0,
      wordCount: finalPrompt.split(/\s+/).filter(Boolean).length,
      userAction: 'export',
      generationMode: result.engineUsed === 'offline-smart-template' ? 'offline_heuristic' : 'ai_gemini'
    });

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

    sendTelemetry({
      domain: result.useCase,
      targetFramework: result.framework,
      targetModel: result.targetModel,
      clarityBefore: result.analysis.clarityScoreBefore,
      clarityAfter: result.analysis.clarityScoreAfter,
      defectsDetected: result.analysis.defectsIdentified.map(d => d.type),
      invariantsInjected: result.analysis.invariantsInjected,
      secretsScrubbedCount: result.analysis.secretsScrubbedCount || 0,
      wordCount: finalPrompt.split(/\s+/).filter(Boolean).length,
      userAction: 'export',
      generationMode: result.engineUsed === 'offline-smart-template' ? 'offline_heuristic' : 'ai_gemini'
    });

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

  // Syntax highlighter for XML tags in preview mode
  const renderHighlightedContent = (text: string) => {
    const parts = text.split(/(<[^>]+>)/g);
    return parts.map((part, index) => {
      if (part.startsWith('<') && part.endsWith('>')) {
        return (
          <span key={index} className="text-cyan-600 dark:text-cyan-400 font-semibold font-mono">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isTransforming) {
    return (
      <div className="craft-chassis rounded-2xl flex flex-col items-center justify-center min-h-[460px] p-8 text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <div>
          <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-white">
            Compiling Meta-Prompt Architecture...
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1 leading-relaxed font-sans">
            Generating edge cases, calculating accessible locators, enforcing auto-wait assertions, and structuring deliverables.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="craft-chassis rounded-2xl flex flex-col items-center justify-center min-h-[460px] p-8 text-center space-y-4 border border-dashed border-slate-300 dark:border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-black/40 flex items-center justify-center border border-slate-200 dark:border-white/[0.08]">
          <FileCode className="w-7 h-7 text-slate-400 dark:text-slate-600" />
        </div>
        <div className="max-w-md">
          <h3 className="font-outfit text-base font-bold text-slate-900 dark:text-slate-200">
            Awaiting Developer Draft
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">
            Enter a task on the left (e.g. &ldquo;test login form&rdquo; or &ldquo;check dns failure&rdquo;) and click <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-outfit">Compile Prompt</span>.
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
    <div className="craft-chassis rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08]">
      {/* Editor Tab Chrome */}
      <div className="bg-slate-100 dark:bg-[#0c0e15] px-4 py-2.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm font-mono text-emerald-700 dark:text-emerald-300">
            <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>compiled.prompt.md</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 ml-1" />
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            Score: {result.clarityScoreAfter}/100
          </span>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 bg-slate-200/80 dark:bg-black/50 p-0.5 rounded-lg border border-slate-300 dark:border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveTab('formatted')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer font-outfit text-xs sm:text-sm ${
              activeTab === 'formatted'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer font-outfit text-xs sm:text-sm ${
              activeTab === 'raw'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw</span>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer font-outfit text-xs sm:text-sm ${
              activeTab === 'breakdown'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Injections</span>
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer font-outfit text-xs sm:text-sm ${
              activeTab === 'diff'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Diff</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Sub Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm bg-slate-100 dark:bg-black/40 p-3 rounded-xl border border-slate-200 dark:border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <span className="font-outfit font-bold text-slate-900 dark:text-white text-sm">{targetPreset?.name || result.targetModel}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/[0.08]">
              {targetPreset?.badge}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{tokenCountEst} tokens</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>{result.engineUsed === 'offline-smart-template' ? 'Offline Engine' : 'AI Powered'}</span>
            </span>
          </div>
        </div>

        {/* Variable Replacer if variables found */}
        {result.detectedVariables.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-300 dark:border-amber-500/20">
            <div className="text-xs font-outfit font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Variables Detected:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.detectedVariables.map(v => (
                <div key={v.key} className="flex items-center space-x-2 text-xs">
                  <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">{`{{${v.key}}}`}:</span>
                  <input
                    type="text"
                    placeholder={`Value for ${v.key}`}
                    value={variableValues[v.key] || ''}
                    onChange={e => handleVariableChange(v.key, e.target.value)}
                    className="flex-1 px-2 py-1 rounded bg-white dark:bg-black/50 border border-slate-300 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Viewer with internal scrolling */}
        <div className="h-[360px] sm:h-[380px] relative craft-inner-input rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.06] flex flex-col">
          {activeTab === 'formatted' && (
            <div className="p-4 overflow-y-auto flex-1 font-mono text-sm sm:text-[15px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
              {renderHighlightedContent(processedText)}
            </div>
          )}

          {activeTab === 'raw' && (
            <textarea
              readOnly
              value={processedText}
              className="w-full h-full p-4 bg-transparent text-slate-800 dark:text-slate-300 font-mono text-sm sm:text-[15px] resize-none focus:outline-none leading-relaxed"
            />
          )}

          {activeTab === 'breakdown' && (
            <div className="p-4 overflow-y-auto flex-1 space-y-3 text-sm">
              <div className="text-slate-800 dark:text-slate-300 font-outfit font-bold pb-2 border-b border-slate-200 dark:border-white/[0.08]">
                Injected Architectural Upgrades:
              </div>
              <div className="space-y-2">
                {result.improvements.map((imp, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 bg-white dark:bg-black/40 p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06]">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diff' && (
            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-sm font-mono">
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 p-3.5 rounded-xl">
                <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">Original Draft:</span>
                <span className="text-slate-600 dark:text-slate-300 line-through opacity-80">{result.originalPrompt}</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/20 p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold block mb-1">Hardened Output (+{(processedText.length - result.originalPrompt.length)} chars):</span>
                <span className="text-emerald-900 dark:text-emerald-200/90">{processedText}</span>
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
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-black/40 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs sm:text-sm font-outfit font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .md</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAsSystem}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-black/40 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs sm:text-sm font-outfit font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy .cursorrules</span>
            </button>
          </div>

          {/* Edge Quality Feedback */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-outfit hidden sm:inline mr-1">
              Quality Rating:
            </span>
            {feedbackStatus ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to D1</span>
              </span>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleFeedback('positive')}
                  className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors cursor-pointer"
                  title="Prompt was effective & solved the problem"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFeedback('negative')}
                  className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors cursor-pointer"
                  title="Prompt needs improvement"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-outfit font-extrabold transition-all shadow-lg tactile-btn cursor-pointer ${
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
