import { map } from 'nanostores';
import { logDebug } from './logLevel';

/**
 * Atom for windows state, will update anytime the state changes
 * 
 * Types
 * - WindowStateChangedEvent: https://overwolf.github.io/api/windows#windowstatechangedevent-object
 */
export const windowStateMap = map<{ [windowName: string]: overwolf.windows.WindowStateChangedEvent }>(
	{}
);

const updateWindowStates = (windowInfo: overwolf.windows.WindowStateChangedEvent) => {
	windowStateMap.setKey(windowInfo.window_name, windowInfo);
	logDebug('[overwolf-nanostores] updateWindowStates', JSON.stringify(windowInfo));
};

overwolf.windows.onStateChanged.removeListener(updateWindowStates);
overwolf.windows.onStateChanged.addListener(updateWindowStates);
