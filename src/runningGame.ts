import { atom } from "nanostores";
import { logDebug } from "./logLevel";

/**
 * get game info update event by `overwolf.games.onGameInfoUpdated`
 * 
 * Types
 * - GameInfoUpdatedEvent: https://overwolf.github.io/api/games#gameinfoupdatedevent-object
 */
export const runningGameAtom = atom<
  overwolf.games.RunningGameInfo | undefined
>();

function onGameInfoUpdated(payload: overwolf.games.GameInfoUpdatedEvent) {
  runningGameAtom.set(payload.gameInfo);
  logDebug("[overwolf-nanostores] onGameInfoUpdated", JSON.stringify(payload));
}

function onGetRunningGameInfo(
  payload: overwolf.games.GetRunningGameInfoResult
): void {
  runningGameAtom.set(payload);
  logDebug(
    "[overwolf-nanostores] onGetRunningGameInfo",
    JSON.stringify(payload)
  );
}

overwolf.games.getRunningGameInfo(onGetRunningGameInfo);
overwolf.games.onGameInfoUpdated.removeListener(onGameInfoUpdated);
overwolf.games.onGameInfoUpdated.addListener(onGameInfoUpdated);
