export type AddAgentRequest = {
    name: string;
    type: AgentTypes;
    haveMolly: boolean;
    haveFlash: boolean;
    createdAt: string;
}

export type AddAgentResponse = {
    message: string;
    name: string;
    id: string;
}

export enum AgentTypes {
    Duelist = 'DUELIST',
    Controller = 'CONTROLLER',
    Initiator = 'INITIATOR',
    Sentinel = 'SENTINEL',
}
