import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
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
  \x1b[32mprompt-maker\x1b[0m \x1b[33mmine\x1b[0m [options]
  \x1b[32mprompt-maker\x1b[0m \x1b[33mmcp\x1b[0m
  \x1b[32mprompt-maker\x1b[0m \x1b[33m--help\x1b[0m | \x1b[33m--version\x1b[0m

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[33m<prompt>\x1b[0m                Enhance a raw developer prompt into a production-grade prompt.
  \x1b[33manalyze <prompt>\x1b[0m        Audit a prompt and diagnose clarity vulnerabilities & missing guards.
  \x1b[33mlearned\x1b[0m                 Explore real-world prompt workflows learned from active repositories.
  \x1b[33mmine\x1b[0m                    Scan local agent sessions and mine real developer prompts across all 26 domains.
  \x1b[33mmcp\x1b[0m                     Start the Model Context Protocol (MCP) server over stdio for AI agents.

\x1b[1mOPTIONS:\x1b[0m
  \x1b[36m-u, --use-case\x1b[0m <id>      Domain use case (default: auto-detected or ui-testing)
                          Available (26 domains): ui-testing, unit-testing, bug-fixing,
                          code-refactoring, feature-implementation, api-design, code-review,
                          db-optimization, devops-docker, devops-infra, security-privacy,
                          secrets-observability, healthcare-doctor, image-generation,
                          concurrency-scaling, webrtc-video, pdf-document-ai, social-automation,
                          iot-terrace-farming, multi-tenant-branding, state-cache-invalidation,
                          monorepo-branch-split, mobile-touch-qa, local-cloud-emulation,
                          patent-compliance, general-developer
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

  \x1b[90m# 4. Mine all real prompts typed across past agent sessions:\x1b[0m
  prompt-maker mine

  \x1b[90m# 5. Launch MCP stdio server for Cursor / Claude Desktop / Windsurf:\x1b[0m
  prompt-maker mcp
`);
}

interface ParsedArgs {
  command: 'enhance' | 'analyze' | 'learned' | 'mine' | 'mcp' | 'help' | 'version';
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

export function inferUseCase(text: string): UseCaseId {
  const t = text.toLowerCase();
  if (t.includes('webrtc') || t.includes('video call') || t.includes('screen share') || t.includes('ice candidate')) {
    return 'webrtc-video';
  }
  if (t.includes('pdf') || t.includes('ocr') || t.includes('exam') || t.includes('scanned')) {
    return 'pdf-document-ai';
  }
  if (t.includes('social') || t.includes('linkedin') || t.includes('twitter') || t.includes('tweet') || t.includes('schedule post')) {
    return 'social-automation';
  }
  if (t.includes('farming') || t.includes('terrace') || t.includes('soil') || t.includes('irrigation') || t.includes('plant')) {
    return 'iot-terrace-farming';
  }
  if (t.includes('white label') || t.includes('tenant') || t.includes('custom domain') || t.includes('clinic1') || t.includes('branding')) {
    return 'multi-tenant-branding';
  }
  if (t.includes('stale') || t.includes('cache') || t.includes('react query') || t.includes('not showing up') || t.includes('optimistic')) {
    return 'state-cache-invalidation';
  }
  if (t.includes('monorepo') || t.includes('branch split') || t.includes('landing page branch') || t.includes('staff portal')) {
    return 'monorepo-branch-split';
  }
  if (t.includes('touch target') || t.includes('virtual keyboard') || t.includes('mobile web') || t.includes('iphone') || t.includes('touch')) {
    return 'mobile-touch-qa';
  }
  if (t.includes('floci') || t.includes('localstack') || t.includes('local aws') || t.includes('s3 local')) {
    return 'local-cloud-emulation';
  }
  if (t.includes('patent') || t.includes('gpl') || t.includes('copyleft') || t.includes('license audit') || t.includes('claims')) {
    return 'patent-compliance';
  }
  if (t.includes('dns') || t.includes('uptime') || t.includes('cloudflare') || t.includes('render') || t.includes('better stack')) {
    return 'devops-infra';
  }
  if (t.includes('docker') || t.includes('dockerfile') || t.includes('container') || t.includes('k8s') || t.includes('kubernetes')) {
    return 'devops-docker';
  }
  if (t.includes('sql') || t.includes('database') || t.includes('postgres') || t.includes('prisma') || t.includes('query')) {
    return 'db-optimization';
  }
  if (t.includes('api') || t.includes('endpoint') || t.includes('rest') || t.includes('webhook') || t.includes('graphql')) {
    return 'api-design';
  }
  if (t.includes('unit test') || t.includes('coverage') || t.includes('mock') || t.includes('jest') || t.includes('vitest')) {
    return 'unit-testing';
  }
  if (t.includes('playwright') || t.includes('cypress') || t.includes('e2e') || t.includes('locator') || (t.includes('test') && !t.includes('unit'))) {
    return 'ui-testing';
  }
  if (t.includes('bug') || t.includes('fix') || t.includes('error') || t.includes('leak') || t.includes('failing') || t.includes('why')) {
    return 'bug-fixing';
  }
  if (t.includes('refactor') || t.includes('clean up') || t.includes('solid')) {
    return 'code-refactoring';
  }
  if (t.includes('security') || t.includes('vulnerability') || t.includes('privacy') || t.includes('zero-trace') || t.includes('auto-burn')) {
    return 'security-privacy';
  }
  if (t.includes('infisical') || t.includes('sentry') || t.includes('secret') || t.includes('env key')) {
    return 'secrets-observability';
  }
  if (t.includes('doctor') || t.includes('patient') || t.includes('hospital') || t.includes('triage') || t.includes('appointment')) {
    return 'healthcare-doctor';
  }
  if (t.includes('image') || t.includes('infographic') || t.includes('midjourney') || t.includes('imagen')) {
    return 'image-generation';
  }
  if (t.includes('concurrency') || t.includes('websocket') || t.includes('socket.io') || t.includes('redis adapter')) {
    return 'concurrency-scaling';
  }
  if (t.includes('code review') || t.includes('pr review') || t.includes('audit')) {
    return 'code-review';
  }
  if (t.includes('create') || t.includes('implement') || t.includes('feature') || t.includes('add')) {
    return 'feature-implementation';
  }
  return 'general-developer';
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
    } else if (first === 'mine' || first === 'extract') {
      result.command = 'mine';
    } else if (first === 'help') {
      result.command = 'help';
    } else {
      result.command = 'enhance';
      result.promptText = positional.join(' ').trim();
    }
  }

  return result;
}

function mineLocalPrompts(): { session: string; prompt: string; inferredUseCase: UseCaseId }[] {
  const brainDir = path.join(os.homedir(), '.gemini/antigravity/brain');
  const results: { session: string; prompt: string; inferredUseCase: UseCaseId }[] = [];
  if (!fs.existsSync(brainDir)) return results;

  const entries = fs.readdirSync(brainDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const logPath = path.join(brainDir, entry.name, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(logPath)) continue;

    try {
      const content = fs.readFileSync(logPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        const data = JSON.parse(line);
        if (data.type === 'USER_INPUT' && typeof data.content === 'string') {
          let text = data.content;
          text = text.replace(/<[^>]+>/g, '').trim();
          if (text.includes('The current local time is:')) {
            text = text.split('The current local time is:')[0].trim();
          }
          if (text.length > 10 && !text.startsWith('Comments on artifact') && !text.startsWith('{"action":')) {
            results.push({
              session: entry.name.slice(0, 8),
              prompt: text,
              inferredUseCase: inferUseCase(text)
            });
          }
        }
      }
    } catch {
      // Continue parsing other sessions
    }
  }
  return results;
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
    await runStdioServer();
    return;
  }

  if (parsed.command === 'mine') {
    const mined = mineLocalPrompts();
    const totalPrompts = mined.length;
    const categoryCounts: Record<string, number> = {};
    for (const item of mined) {
      categoryCounts[item.inferredUseCase] = (categoryCounts[item.inferredUseCase] || 0) + 1;
    }

    if (parsed.json) {
      console.log(JSON.stringify({
        total_prompts: totalPrompts,
        categories: categoryCounts,
        sample_prompts: mined.slice(0, 30)
      }, null, 2));
      return;
    }

    printBanner();
    console.log(`\x1b[1m⚡ Local Developer Prompt Mining Report\x1b[0m`);
    console.log(`---------------------------------------------------------`);
    console.log(`Total Real Prompts Discovered: \x1b[32m\x1b[1m${totalPrompts}\x1b[0m across ~/.gemini/antigravity/brain/\n`);
    console.log(`\x1b[1mDistribution Across Engineering Domains:\x1b[0m`);

    const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    for (const [cat, count] of sortedCats) {
      const pct = ((count / totalPrompts) * 100).toFixed(1);
      const bar = '█'.repeat(Math.min(25, Math.max(1, Math.round(count / 15))));
      console.log(`  \x1b[36m${cat.padEnd(25)}\x1b[0m \x1b[33m${count.toString().padStart(4)}\x1b[0m (${pct.padStart(5)}%) \x1b[90m${bar}\x1b[0m`);
    }

    console.log(`\n\x1b[1mSample Mined Developer Prompts Ready to Compile:\x1b[0m`);
    const seen = new Set<string>();
    let displayed = 0;
    for (const item of mined) {
      if (displayed >= 8) break;
      const snippet = item.prompt.slice(0, 80);
      if (seen.has(snippet)) continue;
      seen.add(snippet);
      displayed++;
      console.log(`  \x1b[35m[${item.session}]\x1b[0m \x1b[1m"${snippet}..."\x1b[0m`);
      console.log(`    \x1b[90m➔ Run:\x1b[0m \x1b[32mprompt-maker "${item.prompt.replace(/"/g, '\\"')}" --use-case ${item.inferredUseCase}\x1b[0m\n`);
    }
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

    const useCase = (parsed.useCase as UseCaseId) || inferUseCase(parsed.promptText);
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
  const useCase = (parsed.useCase as UseCaseId) || inferUseCase(parsed.promptText);
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
