import test from 'node:test';
import assert from 'node:assert/strict';

// Test offline enhancer directly
import { enhancePromptOffline } from '../src/engine/offlineEnhancer.ts';
import { analyzeBadPrompt } from '../src/engine/promptAnalyzer.ts';
import { MODEL_PRESETS } from '../src/data/models.ts';

test('analyzeBadPrompt detects missing elements in brief prompt', () => {
  const badPrompt = 'test login form';
  const analysis = analyzeBadPrompt(badPrompt, 'ui-testing');

  assert.ok(analysis.clarityScore < 50, 'Clarity score should be low for vague prompt');
  assert.ok(analysis.missingElements.length >= 3, 'Should detect multiple missing elements');
  assert.ok(
    analysis.missingElements.some(e => e.includes('locator')),
    'Should flag lack of accessible locator strategy'
  );
});

test('enhancePromptOffline injects accessible locators and deterministic waits for UI testing', () => {
  const result = enhancePromptOffline({
    rawPrompt: 'test the login form with email and password and check if error shows up when invalid',
    useCase: 'ui-testing',
    targetModel: 'claude',
    tone: 'production',
    framework: 'Playwright (TypeScript)'
  });

  assert.ok(result.clarityScoreAfter >= 90, 'Score after should be 90+');
  assert.ok(result.enhancedPrompt.includes('<system>'), 'Claude model should use XML tags');
  assert.ok(result.enhancedPrompt.includes('getByRole'), 'Should enforce getByRole accessible locators');
  assert.ok(result.enhancedPrompt.includes('waitForTimeout'), 'Should forbid hardcoded timeouts');
  assert.ok(result.enhancedPrompt.includes('edge_cases_and_resilience'), 'Should include edge cases section');
});

test('Target models apply correct format wrapping', () => {
  const prompt = 'optimize sql query';
  
  const gptResult = enhancePromptOffline({
    rawPrompt: prompt,
    useCase: 'db-optimization',
    targetModel: 'gpt4o',
    tone: 'crisp'
  });
  assert.ok(gptResult.enhancedPrompt.includes('### Role & Persona'), 'GPT-4o should have Markdown headers');

  const cursorResult = enhancePromptOffline({
    rawPrompt: prompt,
    useCase: 'db-optimization',
    targetModel: 'cursor',
    tone: 'crisp'
  });
  assert.ok(cursorResult.enhancedPrompt.includes('## Anti-Patterns:'), 'Cursor should have concise rules format');
});

test('enhancePromptOffline handles real workspace devops-infra (Better Stack DNS & Keep-Alive)', () => {
  const result = enhancePromptOffline({
    rawPrompt: 'chekc better stack we are getting dns lookup failure',
    useCase: 'devops-infra',
    targetModel: 'gemini',
    tone: 'production',
    framework: 'Cloudflare DNS + Render API'
  });

  assert.ok(result.enhancedPrompt.includes('Cloudflare'), 'Should reference Cloudflare DNS diagnostics');
  assert.ok(result.enhancedPrompt.includes('Better Stack'), 'Should reference Better Stack heartbeat diagnostics');
  assert.ok(result.enhancedPrompt.includes('dig +trace'), 'Should inject terminal verification commands');
});

test('enhancePromptOffline handles real workspace security-privacy (WhisperRoom Zero-Trace)', () => {
  const result = enhancePromptOffline({
    rawPrompt: 'Lets find all security and vunerability and privacy issues. Les e an expert and ffind them',
    useCase: 'security-privacy',
    targetModel: 'claude',
    tone: 'qa-adversarial',
    framework: 'OWASP / Socket.io / WebRTC'
  });

  assert.ok(result.enhancedPrompt.includes('Zero-Trace'), 'Should enforce Zero-Trace RAM storage');
  assert.ok(result.enhancedPrompt.includes('crypto.timingSafeEqual'), 'Should inject timing-safe crypto comparisons');
  assert.ok(result.enhancedPrompt.includes('auto-burn'), 'Should enforce auto-burn synchronization');
});

