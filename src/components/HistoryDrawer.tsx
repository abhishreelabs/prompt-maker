import React, { useState } from 'react';
import { PromptTransformationResult } from '../types';
import { X, Search, Trash2, ArrowUpRight, Copy, Check, Clock } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PromptTransformationResult[];
  onSelectPrompt: (result: PromptTransformationResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPrompt,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.originalPrompt.toLowerCase().includes(term) ||
      item.enhancedPrompt.toLowerCase().includes(term) ||
      item.useCase.toLowerCase().includes(term)
    );
  });

  const handleCopyPrompt = (item: PromptTransformationResult) => {
    navigator.clipboard.writeText(item.enhancedPrompt);
    setCopiedId(item.timestamp);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-transparent">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Prompt Transformation History</h3>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search previous prompts..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {history.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Showing {filteredHistory.length} saved prompts</span>
              <button
                onClick={onClearHistory}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center space-x-1 font-medium text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs space-y-1">
              <p>No prompt history found.</p>
              <p className="text-[11px] text-slate-400">Transformed prompts will be automatically archived here.</p>
            </div>
          ) : (
            filteredHistory.map(item => (
              <div
                key={item.timestamp}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold border border-indigo-500/20 uppercase tracking-wide">
                    {item.useCase}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-300 font-medium line-clamp-2">
                  &ldquo;{item.originalPrompt}&rdquo;
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-900 text-xs">
                  <span className="text-slate-500 text-[11px] font-mono">
                    Score: {item.clarityScoreBefore}% &rarr; {item.clarityScoreAfter}%
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopyPrompt(item)}
                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Copy enhanced prompt"
                    >
                      {copiedId === item.timestamp ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onSelectPrompt(item);
                        onClose();
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-600/20 dark:hover:bg-indigo-600 text-indigo-700 hover:text-white dark:text-indigo-300 font-medium text-[11px] transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-500/30"
                    >
                      <span>Load</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
