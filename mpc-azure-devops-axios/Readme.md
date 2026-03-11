# Azure DevOps MCP Server

A Model Context Protocol (MCP) server that enables AI tools to access Azure DevOps data through structured commands.

## 🤖 GitHub Copilot Integration

This MCP server is fully compatible with GitHub Copilot and other AI coding assistants. The structured JSON responses and well-defined tool interfaces make it easy for AI tools to:

- Retrieve and analyze work items automatically
- Generate code based on requirements from Azure DevOps
- Create test cases from acceptance criteria
- Provide context-aware suggestions based on project state
- Automate development workflows

### Copilot Usage Example

```javascript
// GitHub Copilot can use this MCP server to fetch work item context
const workItem = await copilot.useMcpTool('azure-devops-mcp', 'get_work_item', { id: 49 });

// Use the work item data to generate code
const requirements = workItem.acceptanceCriteria;
const userStory = workItem.title;
const description = workItem.description;
```

## 🚀 Features

- **Secure Azure DevOps Connection** via Personal Access Token (PAT)
- **Work Item Retrieval** by ID with all relevant fields
- **Structured JSON Format** for easy integration with AI tools
- **Development Environment** with configuration variables
- **Integrated Testing** to validate the connection

## 📋 Prerequisites

- Node.js 18 or higher
- Access to an Azure DevOps organization
- Personal Access Token (PAT) with permissions to read work items

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the project root with the following information:

```env
AZURE_ORG=YourAzureOrganization
AZURE_PROJECT=YourAzureProject
AZURE_PAT=YourPersonalAccessToken
```

**Where:**
- `AZURE_ORG`: Your Azure DevOps organization name (e.g., `mycompany`)
- `AZURE_PROJECT`: Exact name of your project in Azure DevOps
- `AZURE_PAT`: Personal Access Token with read permissions

### 2. Install Dependencies

```bash
npm install
```

## 🏃‍♂️ Usage

### Interactive Mode (Testing)

To test the connection and view a specific work item:

```bash
node server.js
```

This will run an automatic test that:
1. Connects to the MCP server
2. Retrieves work item with ID 49
3. Displays all relevant fields in JSON format

### Server Mode

To start the MCP server (requires connection from an AI tool):

```bash
node server.js
```

The server will remain running, waiting for MCP connections.

## 🛠️ Available Tools

### `get_work_item`

Retrieves an Azure DevOps work item by its ID.

**Parameters:**
- `id` (number): ID of the work item to retrieve

**Returned Fields:**
- `id`: Work item ID
- `url`: Direct URL to the work item
- `title`: Work item title
- `description`: Description (in HTML format)
- `state`: Current state
- `reason`: Reason for current state
- `workItemType`: Work item type (User Story, Bug, Task, etc.)
- `areaPath`: Area path
- `iterationPath`: Iteration/sprint path
- `createdBy`: User who created the work item
- `createdDate`: Creation date
- `changedBy`: Last user who modified
- `changedDate`: Last modification date
- `assigned`: Assigned user
- `priority`: Priority (1-4)
- `severity`: Severity (for bugs)
- `tags`: Associated tags
- `acceptanceCriteria`: Acceptance criteria

## 📝 Usage Examples

### Retrieve a User Story

```javascript
// Usage from an MCP tool
{
  "tool": "get_work_item",
  "arguments": {
    "id": 49
  }
}
```

### Expected Result

```json
{
  "id": 49,
  "title": "REQ-EMAIL-03: Shipping Confirmation Email",
  "description": "<div><p><strong>Description</strong>:<br>When an order is shipped...</p></div>",
  "state": "Active",
  "priority": 2,
  "workItemType": "User Story",
  "tags": "Email, Shipping",
  "acceptanceCriteria": "Email must include tracking number, carrier name, tracking link, and delivery window"
}
```

## 🔧 Development

### Project Structure

```
azure-devops-mcp
 ├ server.js
 ├ package.json
 ├ .env
 └ .vscode
     └ mcp.json
```

This script retrieves work item 49 and displays its content in JSON format.

## 🔒 Security

- **PAT (Personal Access Token)**: Store your access token securely
- **Environment Variables**: Never commit the `.env` file to the repository
- **Minimum Permissions**: Use a PAT with only the necessary read permissions

## 🚀 Run

- Add plugin ```Cline``` to Visual Studio Code.
- Verify on Cline: ```What MCP tools are available?```
- it should run the MCP server
- Then use the following code prompt:

```
Use the MCP tool azure-devops.get_work_item with id 49.

Analyze the work item information returned by the tool.

Act as a Senior QA Engineer and generate detailed manual test cases based on the ticket.

Requirements:
- Cover positive scenarios
- Cover negative scenarios
- Cover edge cases
- Include validation scenarios
- Use the title, description, acceptance criteria, tags, and priority to design the tests.

Format each test case as:

Test Case ID:
Title:
Priority:
Preconditions:
Test Steps:
Expected Result:
Test Data:

After generating the test cases:

1. Create a file named `work_item_49_test_cases.md`
2. Save the generated test cases inside that file.
3. Store the file inside the folder `/tests` in the repository.
4. If the `/tests` folder does not exist, create it.

Output only the file content and confirm the file path:
`./tests/work_item_49_test_cases.md`
```
