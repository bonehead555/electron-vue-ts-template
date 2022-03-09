import { contextBridge, ipcRenderer } from "electron";

// As an example, exposeInMainWorld below exposes Electron main's console.log and cosole.error)  
// functions to the renderer.
// Note: To see the handlers for these, see './ipc/rendererIPC.ts'
contextBridge.exposeInMainWorld('mainConsole', 
  {
    log: (text : string) => ipcRenderer.send('mainConsole:log', text),
    error: (text : string) => ipcRenderer.send('mainConsole:error', text),
  });
