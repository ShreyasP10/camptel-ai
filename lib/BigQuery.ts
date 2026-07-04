import { BigQuery } from "@google-cloud/bigquery";

export function getBigQueryClient(): BigQuery {
  return new BigQuery();
}
