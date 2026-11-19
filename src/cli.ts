import { enhancePromptOffline } from './engine/offlineEnhancer.ts';
import { analyzeBadPrompt } from './engine/promptAnalyzer.ts';
import { USE_CASES } from './data/useCases.ts';
import { LEARNED_USER_PROMPTS } from './data/learnedPrompts.ts';
import { runStdioServer } from './mcp/server.ts';
import type { UseCaseId, TargetModel, PromptTone } from './types/index.ts';

const VERSION = '0.1.0';

function printBanner() {
  console.error(`\x1b[36m╔═══════════════════════════════════════════════════════╗\x1b[0m`);
  console.error(`\x1b[36m║\x1b[0m   \x1b[1m\x1b[35m✨ PROMPT MAKER CLI\x1b[0m \x1b[90mv${VERSION}\x1b[0m                         \x1b[36m║\x1b[0m`);
  console.error(`\x1b[36m║\x1b[0m   \x1b[90mSupercharged AI Prompts with Zero Fluff & Zero Stubs\x1b[0m \x1b[36m║\x1b[0m`);
  console.error(`\x1b[36m╚═══════════════════════════════════════════════════════╝\x1b[0m\n`);
}

function printHelp() {
  printBanner();
  console.log(`\x1b[1mUSAGE:\x1b[0m
  \x1b[32mprompt-maker\x1b[0m "<prompt>" [options]
  \x1b[32mprompt-maker\x1b[0m \x1b[33manalyze\x1b[0m "<prompt>" [options]
  \x1b[32mprompt-maker\x1b[0m \x1b[33mlearned\x1b[0m [options]
  \x1b[32mprompt-maker\x1b[0m \x1b[33mmcp\x1b[0m
  \x1b[32mprompt-maker\x1b[0m \x1b[33m--help\x1b[0m | \x1b[33m--version\x1b[0m

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[33m<prompt>\x1b[0m                Enhance a raw developer prompt into a production-grade prompt.
  \x1b[33manalyze <prompt>\x1b[0m        Audit a prompt and diagnose clarity vulnerabilities & missing guards.
  \x1b[33mlearned\x1b[0m                 Explore real-world prompt workflows learned from active repositories.
  \x1b[33mmcp\x1b[0m                     Start the Model Context Protocol (MCP) server over stdio for AI agents.

\x1b[1mOPTIONS:\x1b[0m
  \x1b[36m-u, --use-case\x1b[0m <id>      Domain use case (default: auto-detected or ui-testing)
                          Available: ui-testing, unit-testing, bug-fixing, code-refactoring,
                          feature-implementation, api-design, code-review, db-optimization,
                          devops-docker, devops-infra, security-privacy, secrets-observability,
                          healthcare-doctor, image-generation, concurrency-scaling, general-developer
  \x1b[36m-f, --framework\x1b[0m <name>   Target tech stack/framework (e.g. "Playwright", "FastAPI", "Next.js 16")
  \x1b[36m-m, --model\x1b[0m <model>      Format wrapper: claude (XML), gpt4o (Markdown), gemini, cursor (default: claude)
  \x1b[36m-t, --tone\x1b[0m <tone>        Tone: production, crisp, step-by-step, qa-adversarial (default: production)
  \x1b[36m-j, --json\x1b[0m               Output machine-readable JSON (ideal for AI agent pipelines and tools)
  \x1b[36m-q, --quiet\x1b[0m              Output enhanced prompt content only (suppress metadata banners)
  \x1b[36m-p, --project\x1b[0m <name>     Filter learned workflows by project (WhisperRoom, Hospital, Sentinel, Terrace)
  \x1b[36m-c, --category\x1b[0m <cat>     Filter learned workflows by category

\x1b[1mEXAMPLES:\x1b[0m
  \x1b[90m# 1. Quick enhance for UI testing with Playwright:\x1b[0m
  prompt-maker "test login form with email & password" --use-case ui-testing

  \x1b[90m# 2. Pipe directly to clipboard or file:\x1b[0m
  prompt-maker "create stripe webhook billing endpoint" --use-case api-design --quiet | pbcopy

  \x1b[90m# 3. Analyze prompt defects:\x1b[0m
  prompt-maker analyze "my sql query is slow" --use-case db-optimization

  \x1b[90m# 4. Agent tool JSON output:\x1b[0m
  prompt-maker "dockerize nextjs app with non-root user" --use-case devops-docker --json

  \x1b[90m# 5. Launch MCP stdio server for Cursor / Claude Desktop / Windsurf:\x1b[0m
  prompt-maker mcp
`);
}

interface ParsedArgs {
  command: 'enhance' | 'analyze' | 'learned' | 'mcp' | 'help' | 'version';
  promptText: string;
  useCase?: string;
  framework?: string;
  model?: string;
  tone?: string;
  json: boolean;
  quiet: boolean;
  project?: string;
  category?: string;
}

function parseCliArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
    command: 'enhance',
    promptText: '',
    json: false,
    quiet: false
  };

  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.command = 'help';
      return result;
    }
    if (arg === '--version' || arg === '-v') {
      result.command = 'version';
      return result;
    }
    if (arg === '--json' || arg === '-j') {
      result.json = true;
      continue;
    }
    if (arg === '--quiet' || arg === '-q') {
      result.quiet = true;
      continue;
    }
    if (arg === '--use-case' || arg === '-u') {
      result.useCase = args[++i];
      continue;
    }
    if (arg === '--framework' || arg === '-f') {
      result.framework = args[++i];
      continue;
    }
    if (arg === '--model' || arg === '-m') {
      result.model = args[++i];
      continue;
    }
    if (arg === '--tone' || arg === '-t') {
      result.tone = args[++i];
      continue;
    }
    if (arg === '--project' || arg === '-p') {
      result.project = args[++i];
      continue;
    }
    if (arg === '--category' || arg === '-c') {
      result.category = args[++i];
      continue;
    }

    if (!arg.startsWith('-')) {
      positional.push(arg);
    }
  }

  if (positional.length > 0) {
    const first = positional[0].toLowerCase();
    if (first === 'mcp') {
      result.command = 'mcp';
    } else if (first === 'analyze') {
      result.command = 'analyze';
      result.promptText = positional.slice(1).join(' ').trim();
    } else if (first === 'learned') {
      result.command = 'learned';
    } else if (first === 'help') {
      result.command = 'help';
    } else {
      result.command = 'enhance';
      result.promptText = positional.join(' ').trim();
    }
  }

  return result;
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    printHelp();
    process.exit(0);
  }

  const parsed = parseCliArgs(argv);

  if (parsed.command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (parsed.command === 'version') {
    console.log(`prompt-maker v${VERSION}`);
    process.exit(0);
  }

  if (parsed.command === 'mcp') {
    // Launch stdio MCP server directly
    await runStdioServer();
    return;
  }

  if (parsed.command === 'learned') {
    let workflows = LEARNED_USER_PROMPTS;
    if (parsed.project) {
      workflows = workflows.filter(w => w.project.toLowerCase().includes(parsed.project!.toLowerCase()));
    }
    if (parsed.category) {
      workflows = workflows.filter(w => w.category.toLowerCase().includes(parsed.category!.toLowerCase()));
    }

    if (parsed.json) {
      console.log(JSON.stringify(workflows, null, 2));
      return;
    }

    printBanner();
    console.log(`\x1b[1mFound ${workflows.length} Learned Workspace Workflows:\x1b[0m\n`);
    for (const w of workflows) {
      console.log(`\x1b[35m[${w.project}]\x1b[0m \x1b[1m${w.targetStack}\x1b[0m (\x1b[36m${w.category}\x1b[0m)`);
      console.log(`  \x1b[90mRaw Draft:\x1b[0m "${w.rawUserPrompt}"`);
      console.log(`  \x1b[90mContext:\x1b[0m   ${w.context}`);
      console.log(`  \x1b[32mKey Upgrades:\x1b[0m ${w.keyUpgrades.slice(0, 3).join(' • ')}`);
      console.log();
    }
    return;
  }

  if (parsed.command === 'analyze') {
    if (!parsed.promptText) {
      console.error('\x1b[31mError:\x1b[0m Missing prompt to analyze. Usage: prompt-maker analyze "<prompt>"');
      process.exit(1);
    }

    const useCase = (parsed.useCase as UseCaseId) || 'ui-testing';
    const analysis = analyzeBadPrompt(parsed.promptText, useCase);

    if (parsed.json) {
      console.log(JSON.stringify(analysis, null, 2));
      return;
    }

    printBanner();
    console.log(`\x1b[1mPrompt Audit Report:\x1b[0m`);
    console.log(`----------------------------------------`);
    console.log(`Raw Draft:       "${parsed.promptText}"`);
    console.log(`Word Count:      ${analysis.wordCount}`);
    console.log(`Clarity Score:   \x1b[${analysis.clarityScore < 50 ? '31m' : '32m'}${analysis.clarityScore} / 100\x1b[0m`);
    console.log(`Domain Category: ${useCase}`);

    if (analysis.detectedKeywords.length > 0) {
      console.log(`Detected Terms:  ${analysis.detectedKeywords.join(', ')}`);
    }

    console.log(`\n\x1b[33mMissing Critical Elements (${analysis.missingElements.length}):\x1b[0m`);
    for (const element of analysis.missingElements) {
      console.log(`  ❌ ${element}`);
    }

    if (analysis.missingElements.length > 0) {
      console.log(`\n\x1b[36m💡 Run \`prompt-maker "${parsed.promptText}" --use-case ${useCase}\` to automatically resolve these defects.\x1b[0m\n`);
    }
    return;
  }

  // Default: enhance prompt
  if (!parsed.promptText) {
    console.error('\x1b[31mError:\x1b[0m Missing prompt to enhance. Provide prompt text or run \`prompt-maker --help\`');
    process.exit(1);
  }

  // Determine effective use case
  let useCase = (parsed.useCase as UseCaseId) || 'ui-testing';
  // Simple heuristic if not specified
  if (!parsed.useCase) {
    const textLower = parsed.promptText.toLowerCase();
    if (textLower.includes('dns') || textLower.includes('uptime') || textLower.includes('cloudflare') || textLower.includes('render')) {
      useCase = 'devops-infra';
    } else if (textLower.includes('docker') || textLower.includes('container') || textLower.includes('k8s')) {
      useCase = 'devops-docker';
    } else if (textLower.includes('sql') || textLower.includes('database') || textLower.includes('postgres') || textLower.includes('query')) {
      useCase = 'db-optimization';
    } else if (textLower.includes('api') || textLower.includes('endpoint') || textLower.includes('rest') || textLower.includes('webhook')) {
      useCase = 'api-design';
    } else if (textLower.includes('unit test') || textLower.includes('coverage') || textLower.includes('mock')) {
      useCase = 'unit-testing';
    } else if (textLower.includes('bug') || textLower.includes('fix') || textLower.includes('error') || textLower.includes('leak')) {
      useCase = 'bug-fixing';
    } else if (textLower.includes('refactor') || textLower.includes('clean up')) {
      useCase = 'code-refactoring';
    } else if (textLower.includes('security') || textLower.includes('vulnerability') || textLower.includes('privacy') || textLower.includes('trace')) {
      useCase = 'security-privacy';
    }
  }

  const selectedDef = USE_CASES.find(u => u.id === useCase);
  const framework = parsed.framework || selectedDef?.defaultFramework || 'TypeScript';
  const targetModel = (parsed.model as TargetModel) || 'claude';
  const tone = (parsed.tone as PromptTone) || 'production';

  const result = enhancePromptOffline({
    rawPrompt: parsed.promptText,
    useCase,
    targetModel,
    tone,
    framework
  });

  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!parsed.quiet) {
    printBanner();
    console.error(`\x1b[90mUse Case:\x1b[0m    \x1b[36m${result.useCase}\x1b[0m (\x1b[33m${result.framework}\x1b[0m)`);
    console.error(`\x1b[90mTarget Model:\x1b[0m \x1b[35m${result.targetModel}\x1b[0m | \x1b[90mTone:\x1b[0m \x1b[32m${result.tone}\x1b[0m`);
    console.error(`\x1b[90mClarity Score:\x1b[0m \x1b[31m${result.clarityScoreBefore}/100\x1b[0m ➔ \x1b[32m${result.clarityScoreAfter}/100 (+${result.clarityScoreAfter - result.clarityScoreBefore}pts)\x1b[0m`);
    console.error(`\x1b[90mKey Enhancements:\x1b[0m`);
    for (const imp of result.improvements.slice(0, 4)) {
      console.error(`  ✨ ${imp}`);
    }
    console.error(`\n\x1b[32m──────────────────── COMPILED PROMPT ────────────────────\x1b[0m\n`);
  }

  // Print enhanced prompt to stdout (can be piped to pbcopy or files)
  console.log(result.enhancedPrompt);
}

main().catch(err => {
  console.error('\x1b[31mFatal CLI error:\x1b[0m', err);
  process.exit(1);
});
