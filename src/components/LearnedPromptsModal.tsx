import React, { useState } from 'react';
import { LearnedPromptItem } from '../types/index.ts';
import { LEARNED_USER_PROMPTS } from '../data/learnedPrompts.ts';
import {
  X,
  Sparkles,
  FolderGit2,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

interface LearnedPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (item: LearnedPromptItem) => void;
}

export const LearnedPromptsModal: React.FC<LearnedPromptsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const projects = ['all', ...Array.from(new Set(LEARNED_USER_PROMPTS.map(item => item.project)))];

  const filtered = LEARNED_USER_PROMPTS.filter(item => {
    const matchesProj = selectedProject === 'all' || item.project.includes(selectedProject);
    const matchesQuery =
      item.rawUserPrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetStack.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FolderGit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Curated Production Blueprints</h3>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {LEARNED_USER_PROMPTS.length} Workflows
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Battle-tested engineering patterns across WebSockets, Healthcare, Cloud SRE, FinOps, and Distributed Systems.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search learned prompts, stacks, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 w-full sm:w-auto shrink-0 overflow-x-auto text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Domains</option>
              {projects.filter(p => p !== 'all').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No matching learned prompts found.
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all p-4.5 space-y-3 group"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-mono font-semibold border border-indigo-500/20 text-[11px]">
                      {item.project}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      Stack: <strong className="text-slate-900 dark:text-slate-200">{item.targetStack}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPrompt(item);
                      onClose();
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load & Enhance</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Raw Prompt */}
                <div className="bg-white dark:bg-slate-900/90 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800/80">
                  <div className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center space-x-1">
                    <span>What You Asked In Session:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 leading-relaxed">
                    &ldquo;{item.rawUserPrompt}&rdquo;
                  </p>
                </div>

                {/* Context & Why AI failed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/20 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs sm:text-sm">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Why Raw Prompt Failed Before:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {item.whyItFailedBefore}
                    </p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>What Prompt Maker Upgrades:</span>
                    </div>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      {item.keyUpgrades.slice(0, 3).map((up, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                          <span>{up}</span>
                        </li>
                      ))}
                    </ul>
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
