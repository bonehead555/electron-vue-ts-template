/**
 * @file APIs for accessing methods and data exposed by the Electron Main Process.
 *
 * This file provides friedly API wrappers for IPC APIs exposed by 
 * the Electron Main Process.
 */

import {IMainConsole} from './preload' 

/**
 * Wrapper for console functions exposed by the Electron Main Process.
 * The philosophy here is to first check if the API has been exposed from Electron Main
 * and if not, take some reasonable action (other that crashing with an exception). 
 */
class MainConsole {

  /**
   * Test if the specifc mainConsole API exists in the global window (was exposed by Electon Main).
   * For example, it will not exist if Vite serves content to an independent browser window
   * @param member A particular member to test.
   * @returns True if the particular member exist and false otherwise.
   */
  static existsInWindow(member : string) : boolean {
    return 'mainConsole' in window && member in window.mainConsole;
  }

  /**
   * Send text to stdout on the Electron Main's console or, if the API is not exposed, 
   * send the text to the stdout on the Electron renderer's console.
   * @param text Text to output
   */
  log(text : string) : void {
    if ( MainConsole.existsInWindow('log') ) {
      window.mainConsole.log(text);
    } else {
      console.log(text);
    }
  } 

  /**
   * Send text to stderr on the Electron Main's console or, if the API is not exposed, 
   * send the text to the stderr on the Electron renderer's console.
   * @param text Text to output
   */
  error(text : string) : void {
    if ( MainConsole.existsInWindow('error') ) {
      window.mainConsole.error(text);
    } else {
      console.error(text);
    }
  }
}

/** Provides access to the Electron Main's console functions */
export const mainConsole = new MainConsole;