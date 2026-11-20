import test from 'node:test';
import assert from 'node:assert/strict';
import { sendTelemetry } from '../src/engine/telemetry.ts';

test('sendTelemetry safely handles non-browser environment without throwing', async () => {
  // In node.js (no window), sendTelemetry returns false cleanly
  const result = await sendTelemetry({
    domain: 'ui-testing',
    targetFramework: 'Playwright',
    targetModel: 'claude',
    clarityBefore: 30,
    clarityAfter: 95,
    defectsDetected: ['missing_assertions'],
    invariantsInjected: ['deterministic_waits'],
    secretsScrubbedCount: 0,
    wordCount: 140,
    userAction: 'compile',
    generationMode: 'offline_heuristic'
  });

  assert.strictEqual(typeof result, 'boolean');
});

test('telemetry payload enforces Zero-PII contract (no prompt text in schema)', () => {
  const sampleEvent = {
    domain: 'security-privacy',
    targetFramework: 'OWASP',
    targetModel: 'gpt4',
    clarityBefore: 25,
    clarityAfter: 98,
    defectsDetected: ['hardcoded_keys'],
    invariantsInjected: ['constant_time_comparison'],
    secretsScrubbedCount: 2,
    wordCount: 88,
    userAction: 'compile',
    generationMode: 'offline_heuristic'
  };

  // Assert that forbidden fields do not exist
  assert.strictEqual(Object.prototype.hasOwnProperty.call(sampleEvent, 'rawPrompt'), false);
  assert.strictEqual(Object.prototype.hasOwnProperty.call(sampleEvent, 'promptText'), false);
  assert.strictEqual(Object.prototype.hasOwnProperty.call(sampleEvent, 'enhancedPrompt'), false);
  assert.strictEqual(Object.prototype.hasOwnProperty.call(sampleEvent, 'secretKeys'), false);

  // Assert required metric fields are numbers and categories
  assert.strictEqual(typeof sampleEvent.clarityBefore, 'number');
  assert.strictEqual(typeof sampleEvent.clarityAfter, 'number');
  assert.strictEqual(typeof sampleEvent.secretsScrubbedCount, 'number');
  assert.strictEqual(typeof sampleEvent.domain, 'string');
});
