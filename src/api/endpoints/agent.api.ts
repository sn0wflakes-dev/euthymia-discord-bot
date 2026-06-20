import { AddAgentRequest, AddAgentResponse } from "../../types/api.agents.types";
import { apiClient } from "../client";

export async function addAgent(payload: AddAgentRequest): Promise<AddAgentResponse> {
  return apiClient<AddAgentResponse>('agent', {method: "POST", body: payload});
}
