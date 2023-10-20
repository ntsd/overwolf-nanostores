import { atom } from "nanostores";
import { logDebug, logError } from "./logLevel";

const gamesEvent = overwolf.games.events;
const REGISTER_RETRY_TIMEOUT = 10000;

export const gameEventRequiredFeaturesAtom = atom<string[]>([]);

/**
 * Game events atom.
 * To get this works you need to call `setGameEventRequiredFeatures`to tell the required event featues for the game.
 *
 * Types
 * - NewGameEvents: https://overwolf.github.io/api/games/events#newgameevents-object
 */
export const gameEventAtom = atom<
  overwolf.games.events.NewGameEvents | undefined
>();

/**
 * Game info event atom.
 * To get this works you need to call `setGameEventRequiredFeatures`to tell the required event featues for the game.
 *
 * Types
 * - InfoUpdates2Event: https://overwolf.github.io/api/games/events#infoupdates2event-object
 */
export const gameInfoAtom = atom<
  overwolf.games.events.InfoUpdates2Event | undefined
>();

function handleGameInfo(newInfo: overwolf.games.events.InfoUpdates2Event) {
  gameInfoAtom.set(newInfo);
  logDebug("[overwolf-nanostores] gameInfo", JSON.stringify(newInfo));
}

function handleGameEvent(newEvent: overwolf.games.events.NewGameEvents) {
  gameEventAtom.set(newEvent);
  logDebug("[overwolf-nanostores] gameEvent", JSON.stringify(newEvent));
}

function registerToGepCallback(
  result: overwolf.games.events.SetRequiredFeaturesResult
) {
  if (result.success) {
    gamesEvent.onInfoUpdates2.removeListener(handleGameInfo);
    gamesEvent.onNewEvents.removeListener(handleGameEvent);

    gamesEvent.onInfoUpdates2.addListener(handleGameInfo);
    gamesEvent.onNewEvents.addListener(handleGameEvent);
    return;
  }

  // retry set required if failed
  logError(
    `[overwolf-nanostores] registerToGepCallback failed, retrying in ${REGISTER_RETRY_TIMEOUT}ms:`,
    result.error
  );
  setTimeout(() => {
    gamesEvent.setRequiredFeatures(
      gameEventRequiredFeaturesAtom.get(),
      registerToGepCallback
    );
  }, REGISTER_RETRY_TIMEOUT);
}

/**
 * Sets the required features to get game events and game info events.
 * 
 * @function
 * @param requiredFeatures list of features, list of features will be different from any games
 * you can check the features name from here: https://overwolf.github.io/api/games/events
 */
export function setGameEventRequiredFeatures(requiredFeatures: string[]) {
  gameEventRequiredFeaturesAtom.set(requiredFeatures);
  gamesEvent.setRequiredFeatures(requiredFeatures, registerToGepCallback);
}
