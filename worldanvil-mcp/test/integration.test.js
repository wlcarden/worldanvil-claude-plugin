/**
 * MCP Protocol Integration Tests
 *
 * Tests the MCP server infrastructure - connection, tool listing, error handling.
 * These verify the server works as an MCP server, not WorldAnvil API functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../src/server.js';

describe('MCP Server Protocol', () => {
  let client;
  let server;

  beforeEach(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const result = createServer({
      appKey: 'test-app-key',
      authToken: 'test-auth-token',
    });
    server = result.server;

    client = new Client({
      name: 'test-client',
      version: '1.0.0',
    });

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  it('should connect and respond to listTools', async () => {
    const result = await client.listTools();

    expect(result.tools).toBeDefined();
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);
  });

  it('should include descriptions for all tools', async () => {
    const result = await client.listTools();

    for (const tool of result.tools) {
      expect(tool.description, `Tool ${tool.name} missing description`).toBeDefined();
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });

  it('should include input schemas for all tools', async () => {
    const result = await client.listTools();

    for (const tool of result.tools) {
      expect(tool.inputSchema, `Tool ${tool.name} missing inputSchema`).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }
  });

  it('should return structured error for unknown tool', async () => {
    const result = await client.callTool({
      name: 'unknown_tool',
      arguments: {},
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown tool');
  });

  it('should return structured response even when API fails', async () => {
    // Call a real tool but with fake credentials - should fail gracefully
    const result = await client.callTool({
      name: 'worldanvil_get_identity',
      arguments: {},
    });

    // Should be an error (API fails) but properly formatted
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0].type).toBe('text');
  });
});
