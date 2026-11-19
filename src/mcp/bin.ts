import { runStdioServer } from './server.ts';

runStdioServer().catch(err => {
  console.error('Fatal Prompt Maker MCP server error:', err);
  process.exit(1);
});
