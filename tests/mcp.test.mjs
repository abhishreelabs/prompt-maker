import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mcpBinary = join(__dirname, '../bin/prompt-maker-mcp.js');

test('MCP Server responds to initialize and tools/list', async () => {
  const proc = spawn('node', [mcpBinary], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  proc.stdout.on('data', chunk => {
    output += chunk.toString();
  });

  // 1. Initialize
  const initMsg = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-agent', version: '1.0.0' }
    }
  }) + '\n';

  // 2. Tools list
  const listMsg = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n';

  proc.stdin.write(initMsg);
  proc.stdin.write(listMsg);

  await new Promise(resolve => setTimeout(resolve, 800));
  proc.kill();

  assert.ok(output.includes('prompt-maker'), 'Should contain server name in output');
  assert.ok(output.includes('enhance_developer_prompt'), 'Should list enhance_developer_prompt tool');
  assert.ok(output.includes('analyze_developer_prompt'), 'Should list analyze_developer_prompt tool');
  assert.ok(output.includes('get_learned_workflows'), 'Should list get_learned_workflows tool');
});
