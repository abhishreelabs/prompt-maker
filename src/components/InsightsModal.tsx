import React, { useEffect, useState } from 'react';
import {
  Database,
  X,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { fetchLearningStats, type LearningStatsResponse } from '../engine/telemetry.ts';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<LearningStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    const data = await fetchLearningStats();
    if (data) {
      setStats(data);
      setLastRefreshed(new Date());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0e111a] border border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
                  Cloudflare D1 Edge Intelligence
                </h3>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>D1 SQLite Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero-PII telemetry tracking prompt improvements &amp; defect taxonomy at edge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Privacy Guarantee Box */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-outfit font-bold text-emerald-800 dark:text-emerald-300">
                Guaranteed Zero-PII &amp; Safe Learning Contract
              </div>
              <div className="text-emerald-900 dark:text-emerald-200/90 leading-relaxed font-sans">
                Your prompt text, proprietary code, and secret tokens are <strong>never stored</strong> in our D1 database.
                Only anonymous compiler deltas (clarity gain, domain category, defect tags, and neutralized secret counts) are recorded to help evaluate prompt engineering effectiveness.
              </div>
            </div>
          </div>

          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] space-y-1">
              <div className="text-xs font-outfit text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Prompts Hardened</span>
                <Layers className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-outfit font-extrabold text-slate-900 dark:text-white">
                {stats ? stats.summary?.total_prompts ?? 0 : '...'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Recorded edge compilations
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] space-y-1">
              <div className="text-xs font-outfit text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Avg Clarity Gain</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-outfit font-extrabold text-emerald-600 dark:text-emerald-400">
                {stats ? `+${stats.summary?.avg_clarity_gain ?? 0} pts` : '...'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Average prompt quality boost
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] space-y-1">
              <div className="text-xs font-outfit text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Secrets Guarded</span>
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-outfit font-extrabold text-cyan-600 dark:text-cyan-400">
                {stats ? stats.summary?.total_secrets_guarded ?? 0 : '...'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Credentials sanitized before AI
              </div>
            </div>
          </div>

          {/* Domain Breakdown */}
          {stats && stats.domains && stats.domains.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>Active Domain Distribution</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {stats.domains.map((d) => (
                  <div
                    key={d.domain}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold truncate">
                      {d.domain}
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 ml-2">
                      {d.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Edge Compilations (Zero PII) */}
          <div className="space-y-3">
            <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Recent Anonymous Compilations</span>
            </h4>
            {stats && stats.recent && stats.recent.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 dark:border-white/[0.08] rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-black/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08]">
                    <tr>
                      <th className="p-2.5">Domain</th>
                      <th className="p-2.5">Model</th>
                      <th className="p-2.5">Clarity</th>
                      <th className="p-2.5">Delta</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
                    {stats.recent.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.domain}
                        </td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                          {row.target_model}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.clarity_before} → {row.clarity_after}
                        </td>
                        <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                          +{row.clarity_delta}
                        </td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                          {row.user_action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-300 dark:border-white/10 rounded-xl">
                No compilations recorded yet. Compile your first prompt to see real-time D1 metrics!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Database: prompt-maker-db (APAC)</span>
            {lastRefreshed && (
              <span>• Refreshed {lastRefreshed.toLocaleTimeString()}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-outfit font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-outfit font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
