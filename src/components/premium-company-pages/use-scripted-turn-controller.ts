"use client";

import { useCallback, useState } from "react";

export function useScriptedTurnController() {
  const [busyTurnIds, setBusyTurnIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [stopSignal, setStopSignal] = useState(0);
  const busyTurnCount = busyTurnIds.size;

  const handleScriptedTurnBusyChange = useCallback(
    (turnId: string, isBusy: boolean) => {
      setBusyTurnIds((currentTurnIds) => {
        const nextTurnIds = new Set(currentTurnIds);

        if (isBusy) {
          nextTurnIds.add(turnId);
        } else {
          nextTurnIds.delete(turnId);
        }

        return nextTurnIds;
      });
    },
    [],
  );

  const handleStopAssistantResponse = useCallback(() => {
    setStopSignal((currentSignal) => currentSignal + 1);
    setBusyTurnIds(new Set());
  }, []);

  return {
    busyTurnCount,
    handleScriptedTurnBusyChange,
    handleStopAssistantResponse,
    isAssistantBusy: busyTurnCount > 0,
    stopSignal,
  };
}
