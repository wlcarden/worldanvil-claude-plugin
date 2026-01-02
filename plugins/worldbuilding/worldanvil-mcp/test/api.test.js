/**
 * WorldAnvil API Integration Tests
 *
 * These tests make REAL API calls to WorldAnvil.
 * Requires WA_APP_KEY and WA_AUTH_TOKEN environment variables.
 *
 * Run with: WA_APP_KEY=xxx WA_AUTH_TOKEN=xxx npm test
 *
 * Test World Strategy:
 * 1. If WA_TEST_WORLD_ID is set, use that world directly
 * 2. Otherwise, look for an existing world with "[TEST]" in the name
 * 3. If found, reuse it; if not, create "[TEST] MCP Integration"
 * 4. The test world is NOT deleted (API returns 403 on world deletion)
 *
 * Note: Worlds with [TEST] prefix may be purged - don't store important content!
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { WorldAnvilClient } from '../src/api-client.js';

// Skip all tests if credentials are not provided
const hasCredentials = process.env.WA_APP_KEY && process.env.WA_AUTH_TOKEN;

// Test world configuration
const TEST_WORLD_NAME = '[TEST] MCP Integration';
const TEST_WORLD_PREFIX = '[TEST]';

// Rate limiting helper - WorldAnvil uses Cloudflare protection
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const RATE_LIMIT_DELAY = 750; // 750ms between API calls to avoid Cloudflare 429s

describe.skipIf(!hasCredentials)('WorldAnvil API Integration', () => {
  let client;
  let testWorldId;
  let userId;
  let createdNewWorld = false;

  // Longer timeout for API calls
  const TIMEOUT = 30000;

  // Add delay before each test to avoid rate limiting
  beforeEach(async () => {
    await delay(RATE_LIMIT_DELAY);
  });

  beforeAll(async () => {
    client = new WorldAnvilClient({
      appKey: process.env.WA_APP_KEY,
      authToken: process.env.WA_AUTH_TOKEN,
    });

    // Get user identity first
    const identity = await client.getIdentity();
    userId = identity.id;
    console.log(`Testing as user: ${identity.username}`);

    // Strategy 1: Check for explicit test world ID
    if (process.env.WA_TEST_WORLD_ID) {
      testWorldId = process.env.WA_TEST_WORLD_ID;
      console.log(`Using configured test world: ${testWorldId}`);
      return;
    }

    // Strategy 2: Look for existing [TEST] world
    await delay(RATE_LIMIT_DELAY);
    const worlds = await client.listWorlds();
    const existingTestWorld = worlds.entities.find(w =>
      w.title.startsWith(TEST_WORLD_PREFIX)
    );

    if (existingTestWorld) {
      testWorldId = existingTestWorld.id;
      console.log(`Reusing existing test world: "${existingTestWorld.title}" (${testWorldId})`);
      return;
    }

    // Strategy 3: Create new test world
    await delay(RATE_LIMIT_DELAY);
    const result = await client.createWorld({ title: TEST_WORLD_NAME });
    testWorldId = result.id;
    createdNewWorld = true;
    console.log(`Created new test world: "${TEST_WORLD_NAME}" (${testWorldId})`);
  }, TIMEOUT);

  afterAll(async () => {
    // Note: World deletion returns 403 via API, so we keep the test world for reuse
    if (testWorldId) {
      console.log(`Test world preserved for reuse: ${testWorldId}`);
      if (createdNewWorld) {
        console.log(`  (New world "${TEST_WORLD_NAME}" was created this run)`);
      }
    }
  }, TIMEOUT);

  // ===== IDENTITY =====

  describe('Identity', () => {
    it('should get current user identity', async () => {
      const result = await client.getIdentity();

      expect(result.id).toBeDefined();
      expect(result.username).toBeDefined();
    }, TIMEOUT);
  });

  // ===== WORLDS =====

  describe('Worlds', () => {
    it('should list user worlds', async () => {
      const result = await client.listWorlds();

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
      // Should include our test world
      const testWorld = result.entities.find(w => w.id === testWorldId);
      expect(testWorld).toBeDefined();
    }, TIMEOUT);

    it('should get world details', async () => {
      const result = await client.getWorld(testWorldId);

      expect(result.id).toBe(testWorldId);
      expect(result.title).toContain(TEST_WORLD_PREFIX);
    }, TIMEOUT);

    it('should update world', async () => {
      // Preserve [TEST] prefix so world can be reused in future runs
      const newTitle = `${TEST_WORLD_PREFIX} MCP Integration - Updated ${Date.now()}`;
      await client.updateWorld(testWorldId, { title: newTitle });

      const result = await client.getWorld(testWorldId);
      expect(result.title).toBe(newTitle);
      expect(result.title).toContain(TEST_WORLD_PREFIX);
    }, TIMEOUT);
  });

  // ===== ARTICLES =====

  describe('Articles', () => {
    let articleId;

    it('should create an article', async () => {
      const result = await client.createArticle({
        title: 'Test Article',
        world: { id: testWorldId },
        templateType: 'article',
      });

      expect(result.id).toBeDefined();
      articleId = result.id;
    }, TIMEOUT);

    it('should list articles', async () => {
      const result = await client.listArticles(testWorldId);

      expect(result.entities).toBeDefined();
      const testArticle = result.entities.find(a => a.id === articleId);
      expect(testArticle).toBeDefined();
    }, TIMEOUT);

    it('should get article details', async () => {
      const result = await client.getArticle(articleId);

      expect(result.id).toBe(articleId);
      expect(result.title).toBe('Test Article');
    }, TIMEOUT);

    it('should update article', async () => {
      await client.updateArticle(articleId, { title: 'Updated Article' });

      const result = await client.getArticle(articleId);
      expect(result.title).toBe('Updated Article');
    }, TIMEOUT);

    it('should delete article', async () => {
      await client.deleteArticle(articleId);

      // Verify it's gone
      const list = await client.listArticles(testWorldId);
      const deleted = list.entities.find(a => a.id === articleId);
      expect(deleted).toBeUndefined();
    }, TIMEOUT);
  });

  // ===== CATEGORIES =====

  describe('Categories', () => {
    let categoryId;

    it('should create a category', async () => {
      const result = await client.createCategory({
        title: 'Test Category',
        world: { id: testWorldId },
      });

      expect(result.id).toBeDefined();
      categoryId = result.id;
    }, TIMEOUT);

    it('should list categories', async () => {
      const result = await client.listCategories(testWorldId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should get category details', async () => {
      const result = await client.getCategory(categoryId);

      expect(result.id).toBe(categoryId);
    }, TIMEOUT);

    it('should delete category', async () => {
      await client.deleteCategory(categoryId);
    }, TIMEOUT);
  });

  // ===== SECRETS =====

  describe('Secrets', () => {
    let secretId;

    it('should create a secret', async () => {
      const result = await client.createSecret({
        title: 'Test Secret',
        world: { id: testWorldId },
        content: 'This is secret content',
      });

      expect(result.id).toBeDefined();
      secretId = result.id;
    }, TIMEOUT);

    it('should list secrets', async () => {
      const result = await client.listSecrets(testWorldId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should get secret details', async () => {
      const result = await client.getSecret(secretId);

      expect(result.id).toBe(secretId);
    }, TIMEOUT);

    it('should delete secret', async () => {
      await client.deleteSecret(secretId);
    }, TIMEOUT);
  });

  // ===== TIMELINES =====

  describe('Timelines', () => {
    let timelineId;

    it('should create a timeline', async () => {
      const result = await client.createTimeline({
        title: 'Test Timeline',
        world: { id: testWorldId },
      });

      expect(result.id).toBeDefined();
      timelineId = result.id;
    }, TIMEOUT);

    it('should list timelines', async () => {
      const result = await client.listTimelines(testWorldId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should get timeline details', async () => {
      const result = await client.getTimeline(timelineId);

      expect(result.id).toBe(timelineId);
    }, TIMEOUT);

    it('should delete timeline', async () => {
      await client.deleteTimeline(timelineId);
    }, TIMEOUT);
  });

  // ===== HISTORY EVENTS =====

  describe('History Events', () => {
    let historyId;

    it('should create a history event', async () => {
      const result = await client.createHistory({
        title: 'Test History Event',
        world: { id: testWorldId },
        content: 'A significant event in the world history',
        year: 1000,  // Required field
      });

      expect(result.id).toBeDefined();
      historyId = result.id;
    }, TIMEOUT);

    it('should list history events', async () => {
      const result = await client.listHistories(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);

    it('should get history event details', async () => {
      const result = await client.getHistory(historyId);

      expect(result.id).toBe(historyId);
      expect(result.title).toBe('Test History Event');
    }, TIMEOUT);

    it('should update history event', async () => {
      await client.updateHistory(historyId, {
        title: 'Updated History Event',
        content: 'Updated content for the event',
      });

      const result = await client.getHistory(historyId);
      expect(result.title).toBe('Updated History Event');
    }, TIMEOUT);

    it('should delete history event', async () => {
      await client.deleteHistory(historyId);

      // Verify it's gone
      const list = await client.listHistories(testWorldId);
      const deleted = list.entities.find(h => h.id === historyId);
      expect(deleted).toBeUndefined();
    }, TIMEOUT);
  });

  // ===== MAPS =====
  // Note: Map creation requires an 'image' field which must be an uploaded image.
  // We can only test listing maps on the test world.

  describe('Maps', () => {
    it('should list maps (empty for new world)', async () => {
      const result = await client.listMaps(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);
  });

  // ===== NOTEBOOKS, SECTIONS & NOTES =====

  describe('Notebooks', () => {
    let notebookId;
    let notesectionId;
    let noteId;

    it('should create a notebook', async () => {
      const result = await client.createNotebook({
        title: 'Test Notebook',
        world: { id: testWorldId },
      });

      expect(result.id).toBeDefined();
      notebookId = result.id;
    }, TIMEOUT);

    // NOTE: /world/notebooks endpoint is documented as broken in Swagger:
    // "THIS WILL BE REPLACED WITH A /user/notebooks ENDPOINT IN THE FUTURE. DOES NOT WORK CURRENTLY."
    it.skip('should list notebooks (API endpoint broken per Swagger docs)', async () => {
      const result = await client.listNotebooks(testWorldId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should get notebook', async () => {
      const result = await client.getNotebook(notebookId);

      expect(result.id).toBe(notebookId);
    }, TIMEOUT);

    it('should create a note section', async () => {
      const result = await client.createNotesection({
        title: 'Test Section',
        notebook: { id: notebookId },
      });

      expect(result.id).toBeDefined();
      notesectionId = result.id;
    }, TIMEOUT);

    it('should list note sections', async () => {
      const result = await client.listNotesections(notebookId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should create a note', async () => {
      const result = await client.createNote({
        title: 'Test Note',
        notesection: { id: notesectionId },
        content: 'This is test note content',
        type: 'default',  // Required but undocumented field
      });

      expect(result.id).toBeDefined();
      noteId = result.id;
    }, TIMEOUT);

    it('should list notes', async () => {
      const result = await client.listNotes(notesectionId);

      expect(result.entities).toBeDefined();
      const testNote = result.entities.find(n => n.id === noteId);
      expect(testNote).toBeDefined();
    }, TIMEOUT);

    it('should get note', async () => {
      const result = await client.getNote(noteId);

      expect(result.id).toBe(noteId);
      expect(result.title).toBe('Test Note');
    }, TIMEOUT);

    it('should update note', async () => {
      await client.updateNote(noteId, {
        title: 'Updated Note',
        content: 'Updated content',
      });

      const result = await client.getNote(noteId);
      expect(result.title).toBe('Updated Note');
    }, TIMEOUT);

    it('should delete note', async () => {
      await client.deleteNote(noteId);
    }, TIMEOUT);

    it('should delete note section', async () => {
      await client.deleteNotesection(notesectionId);
    }, TIMEOUT);

    it('should delete notebook', async () => {
      await client.deleteNotebook(notebookId);
    }, TIMEOUT);
  });

  // ===== BLOCKS & FOLDERS =====
  // Block creation requires a BlockTemplate ID. Set TEST_BLOCK_TEMPLATE_ID env var.
  const TEST_TEMPLATE_ID = process.env.TEST_BLOCK_TEMPLATE_ID ? parseInt(process.env.TEST_BLOCK_TEMPLATE_ID) : 19524;

  describe('Blocks', () => {
    let blockFolderId;
    let blockId;

    it('should create a block folder', async () => {
      const result = await client.createBlockFolder({
        title: 'Test Block Folder',
        world: { id: testWorldId },
      });

      expect(result.id).toBeDefined();
      blockFolderId = result.id;
    }, TIMEOUT);

    it('should create a block with template', async () => {
      const result = await client.createBlock({
        title: 'Test Block',
        template: { id: TEST_TEMPLATE_ID },
      });

      expect(result.id).toBeDefined();
      blockId = result.id;
    }, TIMEOUT);

    it('should list blocks', async () => {
      const result = await client.listBlocks(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);

    it('should get block details', async () => {
      if (!blockId) return;
      const result = await client.getBlock(blockId);

      expect(result.id).toBe(blockId);
    }, TIMEOUT);

    it('should update block', async () => {
      if (!blockId) return;
      await client.updateBlock(blockId, { title: 'Updated Block' });

      const result = await client.getBlock(blockId);
      expect(result.title).toBe('Updated Block');
    }, TIMEOUT);

    it('should delete block', async () => {
      if (!blockId) return;
      await client.deleteBlock(blockId);
    }, TIMEOUT);

    it('should list block folders', async () => {
      const result = await client.listBlockFolders(testWorldId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should delete block folder', async () => {
      await client.deleteBlockFolder(blockFolderId);
    }, TIMEOUT);
  });

  // ===== BLOCK TEMPLATES =====
  // Note: Block Template creation requires undocumented 'formSchemaParser' field.
  // Tests use an existing template. Set TEST_BLOCK_TEMPLATE_ID env var or use default.

  describe('Block Templates', () => {
    // Use existing template - creation requires undocumented fields
    const existingTemplateId = TEST_TEMPLATE_ID;
    let blockTemplatePartId;

    it('should list block templates', async () => {
      const result = await client.listBlockTemplates(userId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);

    it('should get block template', async () => {
      const result = await client.getBlockTemplate(existingTemplateId);

      expect(result.id).toBe(existingTemplateId);
      expect(result.title).toBeDefined();
    }, TIMEOUT);

    // Skip create/update/delete template tests - require undocumented formSchemaParser field
    it.skip('should create a block template (requires undocumented formSchemaParser field)', async () => {
      // Block template creation requires formSchemaParser field not documented in Swagger
    }, TIMEOUT);

    it('should create a block template part', async () => {
      const result = await client.createBlockTemplatePart({
        title: 'Test Field',
        type: 'text',
        template: { id: existingTemplateId },
      });

      expect(result.id).toBeDefined();
      blockTemplatePartId = result.id;
    }, TIMEOUT);

    // NOTE: /blocktemplate/blocktemplateparts endpoint has a server-side bug in WorldAnvil's API:
    // "Class RPGSRDBundle\Entity\Block has no field or association named name"
    // Use getBlockTemplate with granularity=2 to get parts instead.
    it.skip('should list block template parts (API endpoint has server-side bug)', async () => {
      const result = await client.listBlockTemplateParts(existingTemplateId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);

    it('should get block template part', async () => {
      const result = await client.getBlockTemplatePart(blockTemplatePartId);

      expect(result.id).toBe(blockTemplatePartId);
    }, TIMEOUT);

    it('should update block template part', async () => {
      await client.updateBlockTemplatePart(blockTemplatePartId, { title: 'Updated Field' });

      const result = await client.getBlockTemplatePart(blockTemplatePartId);
      expect(result.title).toBe('Updated Field');
    }, TIMEOUT);

    it('should delete block template part', async () => {
      await client.deleteBlockTemplatePart(blockTemplatePartId);
    }, TIMEOUT);
  });

  // ===== MANUSCRIPTS =====

  describe('Manuscripts', () => {
    let manuscriptId;

    it('should create a manuscript', async () => {
      const result = await client.createManuscript({
        title: 'Test Manuscript',
        world: { id: testWorldId },
      });

      expect(result.id).toBeDefined();
      manuscriptId = result.id;
    }, TIMEOUT);

    it('should list manuscripts', async () => {
      const result = await client.listManuscripts(testWorldId);

      expect(result.entities).toBeDefined();
    }, TIMEOUT);

    it('should get manuscript', async () => {
      const result = await client.getManuscript(manuscriptId);

      expect(result.id).toBe(manuscriptId);
    }, TIMEOUT);

    it('should delete manuscript', async () => {
      await client.deleteManuscript(manuscriptId);
    }, TIMEOUT);
  });

  // ===== CANVAS (Visual Boards) =====

  describe('Canvas', () => {
    let canvasId;

    it('should create a canvas with empty data', async () => {
      const result = await client.createCanvas({
        title: 'Test Canvas',
        world: { id: testWorldId },
        data: {} // Try empty object for whiteboard data
      });

      expect(result.id).toBeDefined();
      canvasId = result.id;
    }, TIMEOUT);

    it('should list canvases', async () => {
      const result = await client.listCanvases(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);

    it('should get canvas', async () => {
      if (!canvasId) return; // Skip if create failed
      const result = await client.getCanvas(canvasId);

      expect(result.id).toBe(canvasId);
    }, TIMEOUT);

    it('should delete canvas', async () => {
      if (!canvasId) return; // Skip if create failed
      await client.deleteCanvas(canvasId);
    }, TIMEOUT);
  });

  // ===== SUBSCRIBER GROUPS =====
  // Note: Subscriber group operations may require specific World Anvil subscription tiers.
  // We test listing which works on all tiers.

  describe('Subscriber Groups', () => {
    it('should list subscriber groups (empty for new world)', async () => {
      const result = await client.listSubscriberGroups(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);
  });

  // ===== VARIABLE COLLECTIONS & VARIABLES =====

  describe('Variable Collections', () => {
    let collectionId;
    let variableId;

    it('should create a variable collection', async () => {
      const result = await client.createVariableCollection({
        title: 'Test Variable Collection',
        world: { id: testWorldId },
        description: 'A test collection for MCP integration',
        prefix: 'test'
      });

      expect(result.id).toBeDefined();
      collectionId = result.id;
    }, TIMEOUT);

    it('should list variable collections', async () => {
      const result = await client.listVariableCollections(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
      const testCollection = result.entities.find(c => c.id === collectionId);
      expect(testCollection).toBeDefined();
    }, TIMEOUT);

    it('should get variable collection', async () => {
      const result = await client.getVariableCollection(collectionId);

      expect(result.id).toBe(collectionId);
      expect(result.title).toBe('Test Variable Collection');
    }, TIMEOUT);

    it('should update variable collection', async () => {
      await client.updateVariableCollection(collectionId, {
        title: 'Updated Collection',
        description: 'Updated description'
      });

      const result = await client.getVariableCollection(collectionId);
      expect(result.title).toBe('Updated Collection');
    }, TIMEOUT);

    // Variables within collection
    // Note: Despite Swagger showing plain strings, API may require nested objects
    it('should create a variable', async () => {
      const result = await client.createVariable({
        collection: { id: collectionId },
        k: 'test_key',
        type: 'string',
        v: 'Test Value',
        world: { id: testWorldId }
      });

      expect(result.id).toBeDefined();
      variableId = result.id;
    }, TIMEOUT);

    it('should list variables in collection', async () => {
      const result = await client.listVariables(collectionId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
      const testVariable = result.entities.find(v => v.id === variableId);
      expect(testVariable).toBeDefined();
    }, TIMEOUT);

    it('should get variable', async () => {
      const result = await client.getVariable(variableId);

      expect(result.id).toBe(variableId);
    }, TIMEOUT);

    it('should update variable', async () => {
      await client.updateVariable(variableId, {
        v: 'Updated Value'
      });

      const result = await client.getVariable(variableId);
      expect(result.v).toBe('Updated Value');
    }, TIMEOUT);

    it('should delete variable', async () => {
      await client.deleteVariable(variableId);
    }, TIMEOUT);

    // Delete collection last (it would delete variables anyway)
    it('should delete variable collection', async () => {
      await client.deleteVariableCollection(collectionId);
    }, TIMEOUT);
  });

  // ===== RPG SYSTEMS =====

  describe('RPG Systems', () => {
    let rpgSystemId;

    it('should list RPG systems', async () => {
      const result = await client.listRpgSystems();

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
      expect(result.entities.length).toBeGreaterThan(0);
      // Save first system ID for get test
      rpgSystemId = result.entities[0].id;
    }, TIMEOUT);

    it('should get RPG system details', async () => {
      if (!rpgSystemId) return;
      const result = await client.getRpgSystem(rpgSystemId);

      expect(result.id).toBe(rpgSystemId);
      expect(result.title).toBeDefined();
    }, TIMEOUT);
  });

  // ===== IMAGES =====

  describe('Images', () => {
    it('should list images (may be empty for test world)', async () => {
      const result = await client.listImages(testWorldId);

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
    }, TIMEOUT);
  });
});

// Info message when credentials are missing
describe.runIf(!hasCredentials)('API Tests Skipped', () => {
  it('requires WA_APP_KEY and WA_AUTH_TOKEN environment variables', () => {
    console.log('\n  API integration tests skipped - no credentials provided');
    console.log('   Run with: WA_APP_KEY=xxx WA_AUTH_TOKEN=xxx npm test\n');
    expect(true).toBe(true);
  });
});
