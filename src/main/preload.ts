import { contextBridge, ipcRenderer } from "electron";

// As an example, the exposeInMainWorld API is to expose IPC to the renderer.
contextBridge.exposeInMainWorld('electron', 
  {
    ipcRenderer: ipcRenderer,
  });
