import { atom } from "nanostores";
import { logDebug } from "./logLevel";

/**
 * Atom for the current window info object get by `overwolf.windows.getCurrentWindow`
 * 
 * Types
 * - WindowInfo: https://overwolf.github.io/api/windows#windowinfo-object
 */
export const currentWindowInfoAtom = atom<
  overwolf.windows.WindowInfo | undefined
>();

overwolf.windows.getCurrentWindow((result) => {
  if (result.success) {
    currentWindowInfoAtom.set(result.window);
    logDebug(
      "[overwolf-nanostores] getCurrentWindow",
      JSON.stringify(result.window)
    );
  }
});
