import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const cliBinary = join(__dirname, '../bin/prompt-maker.js');

test('CLI --version prints prompt-maker version', async () => {
  const { stdout } = await execFileAsync('node', [cliBinary, '--version']);
  assert.match(stdout, /prompt-maker v\d+\.\d+\.\d+/);
});

test('CLI enhances prompt with --json output', async () => {
  const { stdout } = await execFileAsync('node', [
    cliBinary,
    'test login form with email & password',
    '--use-case',
    'ui-testing',
    '--json'
  ]);

  const parsed = JSON.parse(stdout);
  assert.equal(parsed.useCase, 'ui-testing');
  assert.equal(parsed.clarityScoreAfter, 98);
  assert.ok(parsed.enhancedPrompt.includes('<system>'));
  assert.ok(parsed.enhancedPrompt.includes('getByRole'));
  assert.ok(parsed.enhancedPrompt.includes('ZERO-STUB DIRECTIVE'));
  assert.ok(parsed.enhancedPrompt.includes('crypto.timingSafeEqual'));
});

test('CLI analyze detects defects in brief prompt with --json output', async () => {
  const { stdout } = await execFileAsync('node', [
    cliBinary,
    'analyze',
    'my sql query is slow',
    '--use-case',
    'db-optimization',
    '--json'
  ]);

  const parsed = JSON.parse(stdout);
  assert.ok(parsed.clarityScore < 50);
  assert.ok(parsed.missingElements.length >= 2);
});

test('CLI learned filters workflows by project with --json output', async () => {
  const { stdout } = await execFileAsync('node', [
    cliBinary,
    'learned',
    '--project',
    'WhisperRoom',
    '--json'
  ]);

  const list = JSON.parse(stdout);
  assert.ok(Array.isArray(list));
  assert.ok(list.length > 0);
  assert.ok(list.every(item => item.project.toLowerCase().includes('whisperroom')));
});
