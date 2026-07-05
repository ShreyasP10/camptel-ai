import { BigQuery } from "@google-cloud/bigquery";

function getCredentials() {
  const key = process.env.GCP_SERVICE_ACCOUNT_KEY;
  if (!key) return undefined;
  try {
    return JSON.parse(key);
  } catch {
    return undefined;
  }
}

let client: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
  if (client) return client;

  const projectId = process.env.GCP_PROJECT_ID;
  const credentials = getCredentials();

  if (projectId && credentials) {
    client = new BigQuery({ projectId, credentials });
  } else {
    client = new BigQuery();
  }

  return client;
}

export async function queryBigQuery(sql: string, params?: Record<string, unknown>) {
  const bq = getBigQueryClient();
  const options: { query: string; params?: Record<string, unknown> } = { query: sql };
  if (params) options.params = params;
  const [rows] = await bq.query(options);
  return rows;
}

export function getDatasetPrefix(): string {
  return process.env.BIGQUERY_DATASET || "campus_data";
}
