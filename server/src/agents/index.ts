import { AgentTask } from '../orchestrator/types';
import { discoveryAgent } from './discoveryAgent';
import { generationAgent } from './generationAgent';
import { validationAgent } from './validationAgent';

export type AgentHandler = (task: AgentTask) => Promise<unknown> | unknown;

export const agentHandlers: Record<string, AgentHandler> = {
  discovery: discoveryAgent,
  generation: generationAgent,
  validation: validationAgent,
  default: async () => ({ message: 'No-op handler invoked.' }),
};
