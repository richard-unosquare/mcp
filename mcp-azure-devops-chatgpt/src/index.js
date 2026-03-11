import 'dotenv/config';
import { connectAzureDevOps } from './services/azureClient.js';
import { askQuestion } from './services/aiService.js';

async function main() {
  console.log("ENV CHECK:", {
    base: process.env.AZURE_BASE_URL,
    org: process.env.ORG,
    pat: process.env.AZURE_PAT ? "OK" : "MISSING"
  });

  try {
    const client = await connectAzureDevOps();
     const workItemId = Number(process.env.WORK_ITEM_ID);
    const task = await client.getWorkItem(workItemId);
    console.log(`📌 TASK TITLE:  ${task.fields['System.Title']}`);
    const aiResponse = await askQuestion(task);
    console.log(aiResponse);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
