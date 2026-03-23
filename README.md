
# 🎩 Notion Advisory Board MCP

An advanced Model Context Protocol (MCP) server that transforms any Notion proposal into an automated strategic war-room.

By simply pasting a Notion link into Claude Desktop, this MCP server automatically reads your document, queries a historical "Lessons Learned" Notion database for past failures/successes, and executes a comprehensive **7 Hats Analysis** (based on the Six Thinking Hats). It then natively writes the resulting debate and a structured summary directly back into your Notion page.

## ✨ Features

-   **Zero-Prompt Orchestration:** Hidden system instructions guide the AI to run the entire 7-step workflow automatically.
-   **Data-Backed Skepticism:** The `get_historical_lessons` tool queries your actual Notion databases so the "Black Hat" and "Technical Hat" base their critiques on your real-world past project failures.
-   **Native Notion UI:** Uses Notion's `append_block_children` API to generate beautifully formatted, color-coded callout boxes for each "Hat".
-   **Prompt-Injection Safe:** Wraps user content in strict XML tags to prevent malicious proposals from hijacking the MCP workflow.
    
## 🚀 Setup & Installation

### 1. Prerequisites
-   **Node.js** (v18 or higher)
-   **Claude Desktop** App
-   A **Notion Workspace**
    
### 2. Notion Setup

1.  Go to [Notion My Integrations](https://www.notion.so/my-integrations "null") and create a new "Internal Integration" named **Advisory Board**.    
2.  Copy the **Internal Integration Secret** (`NOTION_API_KEY`).   
3.  Create a new Notion Database called "Lessons Learned" with the following columns: `Project Name` (Title), `Outcome` (Select), `Tags` (Multi-select), and `Key Lesson / Post-Mortem` (Text). Example: [Notion - Lesson Learned](https://www.notion.so/08069d17e80883aaa6a981a9ba7468db?v=71969d17e808823b86f3886a2efd666d&source=copy_link)
4.  Copy the **Database ID** from the URL of your Lessons Learned database (the long string before the `?v=`).  
5.  **CRITICAL:** Click the `...` menu in the top right of your database and select **Connect to** -> **Advisory Board** to grant the integration access. (You must also do this for any proposal page you want Claude to analyze!).
    

### 3. Local Installation
Clone this repository and install the dependencies:

```
git clone <your-repo-url>
cd notion-advisory-board
npm install

```

### 4. Claude Desktop Configuration

Open your Claude Desktop config file.
-   Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
-   Windows: `%APPDATA%\Claude\claude_desktop_config.json`
    
Add the server configuration using native Node.js (we avoid `dotenv` and `ts-node` to ensure a completely silent, crash-free JSON connection):

```
{
  "mcpServers": {
    "advisory-board": {
      "command": "node",
      "args": [
        "C:/Absolute/Path/To/Your/notion-advisory-board/index.js"
      ],
      "env": {
        "NOTION_API_KEY": "secret_your_notion_key_here",
        "LESSONS_DB_ID": "your_database_id_here"
      }
    }
  }
}

```

Restart Claude Desktop completely after saving this file.

## 💡 Usage

In Claude Desktop, simply say:

> _"Analyze this proposal: https://www.google.com/search?q=https://notion.so/your-workspace/your-page-id"_

[Sample Proposal](https://www.notion.so/Proposal-Real-time-Analytics-Dashboard-eef69d17e80882a5afc18140dd9ce8a2?source=copy_link)

Sit back and watch the Advisory Board debate and summarize the proposal right inside your Notion document!
