import { VertexAI } from "@google-cloud/vertexai";

export function getVertexAIClient(): VertexAI {
  return new VertexAI({ project: process.env.GCP_PROJECT_ID, location: "us-central1" });
}
