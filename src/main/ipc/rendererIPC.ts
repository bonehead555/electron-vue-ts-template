/**
 * @file API handlers for IPCs exposed to the Electron Renderer Process.
 *
 * This file registers and in some cases implements IPC APIs for access by the\ 
 * the Electron Renderer Process.
 */

import { ipcMain } from "electron";

/**
 *  Registers ALL IPC interfaces used between Electron's Main and Renderer processes.
 *  WARINING: Should be called from within the Electron app's "whenReady" handler.
 */ 
export function registerRendererIPC() : void {
  // mainConsole handlers.
  ipcMain.on('mainConsole:log', (event: Electron.IpcMainEvent,text: string) => {console.log(text)});
  ipcMain.on('mainConsole:error', (event: Electron.IpcMainEvent,text: string) => {console.error(text)});
}