import axios from "axios";
import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

dotenv.config();

const org = process.env.AZURE_ORG;
const project = process.env.AZURE_PROJECT;
const pat = process.env.AZURE_PAT;

if (!org || !project || !pat) {
  throw new Error("Missing AZURE_ORG, AZURE_PROJECT or AZURE_PAT in .env");
}

const encodedProject = encodeURIComponent(project);

// ---------------------
// Azure DevOps API
// ---------------------

async function getWorkItem(id) {

  const url = `https://dev.azure.com/${org}/${encodedProject}/_apis/wit/workitems/${id}?api-version=7.0`;

  const res = await axios.get(url, {
    auth: {
      username: "",
      password: pat
    },
    headers: {
      "Content-Type": "application/json"
    }
  });

  return res.data;
}

// ---------------------
// MCP SERVER
// ---------------------

const server = new McpServer({
  name: "azure-devops-mcp",
  version: "1.0.0"
});

server.tool(
  "get_work_item",
  "Retrieve an Azure DevOps work item by ID",
  {
    id: {
      type: "number",
      description: "Work item ID"
    }
  },
  async ({ id }) => {

    try {

      const data = await getWorkItem(id);
      const item = data.fields;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              id: data.id,
              url: data.url,

              title: item["System.Title"],
              description: item["System.Description"],
              state: item["System.State"],
              reason: item["System.Reason"],
              workItemType: item["System.WorkItemType"],
              areaPath: item["System.AreaPath"],
              iterationPath: item["System.IterationPath"],
              createdBy: item["System.CreatedBy"]?.displayName,
              createdDate: item["System.CreatedDate"],
              changedBy: item["System.ChangedBy"]?.displayName,
              changedDate: item["System.ChangedDate"],
              assigned: item["System.AssignedTo"]?.displayName,
              priority: item["Microsoft.VSTS.Common.Priority"],
              severity: item["Microsoft.VSTS.Common.Severity"],

              tags: item["System.Tags"],

              acceptanceCriteria:
                item["Microsoft.VSTS.Common.AcceptanceCriteria"] ||
                item["Custom.AcceptanceCriteria"]

            }, null, 2)
          }
        ]
      };

    } catch (err) {

      return {
        content: [
          {
            type: "text",
            text: `Error: ${err.response?.data || err.message}`
          }
        ]
      };

    }

  }
);

// ---------------------
// TEST
// ---------------------

async function test() {
  try {
    console.log("\nTesting Azure DevOps connection...\n");
    const data = await getWorkItem(49);
    console.log("--------------- WORK ITEM ---------------");
    console.log("ID:", data.id);
    console.log("Type:", data.fields["System.WorkItemType"]);
    console.log("Title:", data.fields["System.Title"]);
    console.log("State:", data.fields["System.State"]);
    console.log("Reason:", data.fields["System.Reason"]);
    console.log("Created By:", data.fields["System.CreatedBy"]?.displayName);
    console.log("Created Date:", data.fields["System.CreatedDate"]);
    console.log("Assigned To:", data.fields["System.AssignedTo"]?.displayName);
    console.log("Changed By:", data.fields["System.ChangedBy"]?.displayName);
    console.log("Changed Date:", data.fields["System.ChangedDate"]);
    console.log("Area Path:", data.fields["System.AreaPath"]);
    console.log("Iteration Path:", data.fields["System.IterationPath"]);
    console.log("Priority:", data.fields["Microsoft.VSTS.Common.Priority"]);
    console.log("Severity:", data.fields["Microsoft.VSTS.Common.Severity"]);
    console.log("Tags:", data.fields["System.Tags"]);
    console.log("Description:", data.fields["System.Description"]);
    console.log(
      "Acceptance Criteria:",
      data.fields["Microsoft.VSTS.Common.AcceptanceCriteria"] ||
      data.fields["Custom.AcceptanceCriteria"] ||
      "Not provided"
    );
    console.log("------------------------------------------");
  } catch (err) {
    console.error("TEST FAILED:");
    console.error(err.response?.data || err.message);
  }

}

// ---------------------
// START SERVER
// ---------------------

async function start() {
  const transport = new StdioServerTransport();
  console.log("\nAzure DevOps MCP Server running...\n");
  await server.connect(transport);

}

// run test then server
await test();
await start();
