import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@notionhq/client";
import { z } from "zod";

// NOTE: We completely removed "dotenv" because it was polluting the terminal 
// output. Claude Desktop injects the keys from your config file automatically!

// Initialize Notion Client
const notion = new Client({ auth: process.env.NOTION_API_KEY || "" });
const LESSONS_DB_ID = process.env.LESSONS_DB_ID || "";

const server = new McpServer({
  name: "Advisory Board",
  version: "1.0.0",
});

// TOOL 1: Read the Proposal Page
server.tool("analyze_proposal", { page_id: z.string() }, async ({ page_id }) => {
  const response = await notion.blocks.children.list({ block_id: page_id });
  const text = response.results
    .map((block) => {
      const type = block.type;
      return block[type]?.rich_text?.[0]?.plain_text || "";
    })
    .join("\n");
  
  return {
    content: [{ type: "text", text: `Proposal Content Found:\n${text}` }],
  };
});

// TOOL 2: Check Historical Lessons
server.tool("get_historical_lessons", { keywords: z.array(z.string()) }, async ({ keywords }) => {
  const response = await notion.databases.query({
    database_id: LESSONS_DB_ID,
    filter: {
      or: keywords.map(word => ({
        property: "Tags",
        multi_select: { contains: word }
      }))
    }
  });

  const lessons = response.results.map((page) => {
    const name = page.properties.Name.title[0]?.plain_text || "Unknown Project";
    const lesson = page.properties.Lesson.rich_text[0]?.plain_text || "No details";
    return `- ${name}: ${lesson}`;
  }).join("\n");

  return {
    content: [{ type: "text", text: lessons || "No historical warnings found." }],
  };
});

// TOOL 3: Post Agent Opinion (The Colored Boxes)
server.tool("post_opinion", { 
    page_id: z.string(), 
    agent: z.enum(["Optimist", "Cynic", "Realist"]), 
    text: z.string() 
}, async ({ page_id, agent, text }) => {
  const colors = { 
    Optimist: "green_background", 
    Cynic: "red_background", 
    Realist: "blue_background" 
  };
  const emojis = { 
    Optimist: "🟢", 
    Cynic: "🔴", 
    Realist: "🔵" 
  };

  await notion.blocks.children.append({
    block_id: page_id,
    children: [{
      type: "callout",
      callout: {
        rich_text: [{ type: "text", text: { content: `${agent.toUpperCase()}: ${text}` } }],
        icon: { emoji: emojis[agent] },
        color: colors[agent],
      },
    }],
  });

  return { content: [{ type: "text", text: `Opinion posted successfully.` }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);