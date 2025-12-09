let lastDebug: any = null;

export const setLastOrchestratorDebug = (data: any) => {
  lastDebug = data;
};

export const getLastOrchestratorDebug = () => lastDebug;
