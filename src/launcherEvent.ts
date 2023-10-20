import { atom } from "nanostores";
import { logDebug, logError } from "./logLevel";

const launcherEvent = overwolf.games.launchers.events;
const REGISTER_RETRY_TIMEOUT = 10000; // 10s

/**
 * Launcher events atom.
 * To get this works you need to call `setLauncherEventRequiredFeatures`to tell the required event featues for the game.
 *
 * Currently there is no type define for this object.
 */
export const launcherEventAtom = atom<any>({});

/**
 * Launcher info event atom.
 * To get this works you need to call `setLauncherEventRequiredFeatures`to tell the required event featues for the game.
 *
 * Currently there is no type define for this object.
 */
export const launcherInfoAtom = atom<any>({});

function handlerLauncherInfo(newInfo: any) {
  launcherInfoAtom.set(newInfo);
  logDebug(
    "[overwolf-nanostores] handlerLauncherInfo",
    JSON.stringify(newInfo)
  );
}

function handleLauncherEvent(newEventData: any) {
  launcherEventAtom.set(newEventData);
  logDebug(
    "[overwolf-nanostores] handleLauncherEvent",
    JSON.stringify(newEventData)
  );
}

function getSetRequiredFeaturesCb(
  launcherClassId: number,
  requiredFeatures: string[]
) {
  function setRequiredFeaturesCb(
    result: overwolf.games.events.SetRequiredFeaturesResult
  ) {
    if (result.success) {
      launcherEvent.onInfoUpdates.removeListener(handlerLauncherInfo);
      launcherEvent.onNewEvents.removeListener(handleLauncherEvent);

      launcherEvent.onInfoUpdates.addListener(handlerLauncherInfo);
      launcherEvent.onNewEvents.addListener(handleLauncherEvent);
      return;
    }

    // retry set required if failed
    logError(
      `[overwolf-nanostores] registerEventListerner failed, retrying in ${REGISTER_RETRY_TIMEOUT}ms:`,
      result.error
    );
    setTimeout(() => {
      launcherEvent.setRequiredFeatures(
        launcherClassId,
        requiredFeatures,
        getSetRequiredFeaturesCb(launcherClassId, requiredFeatures)
      );
    }, REGISTER_RETRY_TIMEOUT);
  }
  return setRequiredFeaturesCb;
}

/**
 * Sets the required features to get launcher events and launcher info events.
 * @function
 *
 * @param requiredFeatures list of features, list of features will be different from any launcher
 * you can check the features name from here: https://overwolf.github.io/api/live-game-data/supported-launchers/league-of-legends
 */
export function setLauncherEventRequiredFeatures(
  launcherClassId: number,
  requiredFeatures: string[]
) {
  launcherEvent.setRequiredFeatures(
    launcherClassId,
    requiredFeatures,
    getSetRequiredFeaturesCb(launcherClassId, requiredFeatures)
  );
}
