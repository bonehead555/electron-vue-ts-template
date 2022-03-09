/**
 * @file TypeScript Type Information for Electron Main's preload APIs
 *
 * This file exposes type information to the Electron renderer process
 * for the raw interfaces exposed by the preload.ts/js file injected by
 * Electron onto the window object of the renderer.
 */
 
/**
 * Interface representing the mainConsole method exposed in preload.ts
 */
export interface IMainConsole {
  /**
   * Output a string to stdout of the Electron Main Process.
   * @param {string} text - The string to output.
   */
  log: (text: string) => void,

  /**
   * Output a string to stderr of the Electron Main Process.
   * @param {string} text - The string to output.
   */
  error: (text: string) => void,
}

declare global {
  interface Window {
    /** The Electron Main API for console output */
    mainConsole: IMainConsole,
  }
}
