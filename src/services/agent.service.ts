import { ApiError } from "../api/client";
import { addAgent } from "../api/endpoints/agent.api";
import { log } from "../config/logging";
import { AddAgentRequest, AddAgentResponse } from "../types/api.agents.types";

export async function addAgentService(payload: AddAgentRequest): Promise<AddAgentResponse> {

  try {
    return await addAgent(payload);
  } catch (error) {

    log.error(`Add agent service error : `, error);

    if (error instanceof ApiError) {
      log.error(`Failed to add agent, error : ${error.message}`);
      throw new Error(`Failed to add agent ${error.message}`);
    }

    throw new Error("Failed to add agent");
    
  }

}
