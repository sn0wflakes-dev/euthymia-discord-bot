import { getNsfwGrpcClient } from "../client";
import { log } from "../../config/logging";

export interface ClassifyRequest {
  image_data: Buffer;
  filename: string;
}

export interface ClassifyResponse {
  label: string;
  confidence: number;
  prob_sfw: number;
  prob_sketchy: number;
  prob_nsfw: number;
  latency_ms: number;
  filename: string;
}

export async function classifyImage(req: ClassifyRequest): Promise<ClassifyResponse> {
  const client = getNsfwGrpcClient();

  return new Promise((resolve, reject) => {
    client.Classify(req, (error: Error | null, response: ClassifyResponse) => {
      if (error) {
        log.error(`gRPC Classify error: ${error.message}`);
        return reject(error);
      }
      resolve(response);
    });
  });
}
