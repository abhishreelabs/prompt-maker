import React, { useState } from 'react';
import { X, Bot, Copy, Check, ShieldCheck } from 'lucide-react';

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const McpModal: React.FC<McpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cursor' | 'claude' | 'windsurf' | 'cli'>('cursor');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const configs: Record<'cursor' | 'claude' | 'windsurf' | 'cli', { title: string; filename: string; content: string }> = {
    cursor: {
      title: 'Cursor IDE (.cursor/mcp.json)',
      filename: '.cursor/mcp.json',
      content: JSON.stringify(
        {
          mcpServers: {
            'prompt-maker': {
              command: 'npx',
              args: ['-y', '@s.engineerabhisheksahu/prompt-maker', 'mcp']
            }
          }
        },
        null,
        2
      )
    },
    claude: {
      title: 'Claude Desktop App',
      filename: '~/Library/Application Support/Claude/claude_desktop_config.json',
      content: JSON.stringify(
        {
          mcpServers: {
            'prompt-maker': {
              command: 'npx',
              args: ['-y', '@s.engineerabhisheksahu/prompt-maker', 'mcp']
            }
          }
        },
        null,
        2
      )
    },
    windsurf: {
      title: 'Windsurf IDE (Codeium)',
      filename: '~/.codeium/windsurf/mcp_config.json',
      content: JSON.stringify(
        {
          mcpServers: {
            'prompt-maker': {
              command: 'npx',
              args: ['-y', '@s.engineerabhisheksahu/prompt-maker', 'mcp']
            }
          }
        },
        null,
        2
      )
    },
    cli: {
      title: 'Terminal / Background Process',
      filename: 'Command Line',
      content: 'npx -y @s.engineerabhisheksahu/prompt-maker mcp'
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 1800);
  };

  const current = configs[activeTab];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Model Context Protocol (MCP) Server</h3>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                  Ready for AI Agents
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Let Cursor, Claude, Windsurf, or Antigravity agents enhance your prompts before writing code.
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

        {/* Tab selection */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/30 flex items-center space-x-2 text-xs">
          {(['cursor', 'claude', 'windsurf', 'cli'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-900 dark:text-slate-300 font-semibold">{current.title}</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{current.filename}</span>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
              {current.content}
            </pre>
            <button
              onClick={() => handleCopy(activeTab, current.content)}
              className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shadow-sm cursor-pointer"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Config</span>
                </>
              )}
            </button>
          </div>

          {/* Tools exposed summary */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-2.5 text-xs sm:text-sm">
            <div className="text-slate-900 dark:text-slate-300 font-semibold flex items-center space-x-1.5 text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Tools Available to Your AI Agent:</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              <li>
                <strong className="text-slate-900 dark:text-slate-200 font-mono">enhance_developer_prompt:</strong> Rewrites raw tasks into production prompts with personas, resilient locators, and edge cases.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-200 font-mono">analyze_developer_prompt:</strong> Returns a gap analysis of missing test assertions, brittle selectors, and clarity score.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-200 font-mono">get_learned_workflows:</strong> Fetches exact blueprints from real developer workflows (Realtime Messaging, Healthcare, DevOps, Document AI, etc.).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-200 font-mono">list_supported_use_cases:</strong> Lists all 26 supported engineering domains and default frameworks.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[400px]">MCP Stdio: <code className="font-mono text-slate-700 dark:text-slate-400">npx @s.engineerabhisheksahu/prompt-maker mcp</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
