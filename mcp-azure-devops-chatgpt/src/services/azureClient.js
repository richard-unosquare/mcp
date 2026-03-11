import * as azdev from "azure-devops-node-api";
import "dotenv/config";

export async function connectAzureDevOps() {
  const baseUrl = process.env.AZURE_BASE_URL;
  const org = process.env.ORG;
  const pat = process.env.AZURE_PAT;

  if (!baseUrl || !org || !pat) {
    throw new Error("Faltan AZURE_BASE_URL, ORG o AZURE_PAT en el .env");
  }

  const orgUrl = `${baseUrl}${org}`;

  const authHandler = azdev.getPersonalAccessTokenHandler(pat);
  const connection = new azdev.WebApi(orgUrl, authHandler);

  const client = await connection.getWorkItemTrackingApi();
  return client;
}
