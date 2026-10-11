import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('focusDeskStorage', {
  getTasks: () => ipcRenderer.invoke('storage:get-tasks'),
  setTasks: (tasks: unknown) => 
    ipcRenderer.invoke('storage:set-tasks', tasks),

  getSessions: () => ipcRenderer.invoke('storage:get-sessions'),
  setSessions: (sessions: unknown) =>
    ipcRenderer.invoke('storage:set-sessions', sessions)
})
