import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function safe(field) {
  return field ? field : "N/A";
}

export async function askQuestion(task) {
  // Prompt base desde archivo
  const basePrompt = fs.readFileSync("prompts/prompt.txt", "utf-8");
  // Contexto EXTENDIDO del Work Item
  const context = `
AZURE DEVOPS WORK ITEM CONTEXT
ID:
${safe(task.id)}
TYPE:
${safe(task.fields["System.WorkItemType"])}
TITLE:
${safe(task.fields["System.Title"])}
DESCRIPTION:
${safe(task.fields["System.Description"])}
STATE:
${safe(task.fields["System.State"])}
PRIORITY:
${safe(task.fields["Microsoft.VSTS.Common.Priority"])}
SEVERITY:
${safe(task.fields["Microsoft.VSTS.Common.Severity"])}
ASSIGNED TO:
${safe(task.fields["System.AssignedTo"]?.displayName)}
CREATED BY:
${safe(task.fields["System.CreatedBy"]?.displayName)}
AREA PATH:
${safe(task.fields["System.AreaPath"])}
ITERATION PATH:
${safe(task.fields["System.IterationPath"])}
TAGS:
${safe(task.fields["System.Tags"])}
ACCEPTANCE CRITERIA:
${safe(task.fields["Microsoft.VSTS.Common.AcceptanceCriteria"])}
REPRO STEPS:
${safe(task.fields["Microsoft.VSTS.Common.ReproSteps"])}
COMMENTS / HISTORY:
${safe(task.fields["System.History"])}
RELATED LINKS:
${task.relations ? JSON.stringify(task.relations, null, 2) : "N/A"}
`;
  // Prompt final que recibe la IA
  const finalPrompt = `
${basePrompt}
${context}
`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: finalPrompt }],
    temperature: 0.2
  });

  return response.choices[0].message.content;
}
