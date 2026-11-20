import fs from 'node:fs';
import path from 'node:path';

export interface DetectedWorkspace {
  name: string;
  techStack: string;
  testCommand?: string;
  buildCommand?: string;
  devCommand?: string;
  keyDependencies: string[];
  summary: string;
}

export function detectLocalWorkspace(startDir: string = process.cwd()): DetectedWorkspace | null {
  try {
    let currentDir = path.resolve(startDir);
    let packageJsonPath: string | null = null;

    // Search up to 3 levels up for package.json
    for (let i = 0; i < 3; i++) {
      const candidate = path.join(currentDir, 'package.json');
      if (fs.existsSync(candidate)) {
        packageJsonPath = candidate;
        break;
      }
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break;
      currentDir = parent;
    }

    if (!packageJsonPath) {
      return null;
    }

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {})
    };

    const depNames = Object.keys(allDeps);
    const stackParts: string[] = [];

    // Framework detection
    if (allDeps['next']) stackParts.push(`Next.js ${allDeps['next'].replace(/[^0-9.]/g, '') || ''}`.trim());
    else if (allDeps['react']) stackParts.push(`React ${allDeps['react'].replace(/[^0-9.]/g, '') || ''}`.trim());
    else if (allDeps['vue']) stackParts.push('Vue');
    else if (allDeps['svelte']) stackParts.push('Svelte');

    // Bundler
    if (allDeps['vite']) stackParts.push('Vite');
    if (allDeps['esbuild']) stackParts.push('esbuild');

    // Language
    if (allDeps['typescript'] || fs.existsSync(path.join(currentDir, 'tsconfig.json'))) {
      stackParts.push('TypeScript');
    }

    // Styling
    if (allDeps['tailwindcss'] || allDeps['@tailwindcss/vite']) stackParts.push('Tailwind CSS');

    // Testing
    if (allDeps['playwright'] || allDeps['@playwright/test']) stackParts.push('Playwright');
    else if (allDeps['vitest']) stackParts.push('Vitest');
    else if (allDeps['jest']) stackParts.push('Jest');
    else if (pkg.scripts?.test && pkg.scripts.test.includes('--test')) stackParts.push('Node Test Runner');

    // Backend / APIs
    if (allDeps['@modelcontextprotocol/sdk']) stackParts.push('MCP SDK');
    if (allDeps['express']) stackParts.push('Express');
    if (allDeps['fastapi']) stackParts.push('FastAPI');

    const techStack = stackParts.join(' + ') || 'Node.js';
    const testCommand = pkg.scripts?.test ? 'npm test' : undefined;
    const buildCommand = pkg.scripts?.build ? 'npm run build' : undefined;
    const devCommand = pkg.scripts?.dev ? 'npm run dev' : undefined;

    const summary = `${pkg.name || path.basename(currentDir)} (${techStack})`;

    return {
      name: pkg.name || path.basename(currentDir),
      techStack,
      testCommand,
      buildCommand,
      devCommand,
      keyDependencies: depNames.slice(0, 10),
      summary
    };
  } catch {
    return null;
  }
}
