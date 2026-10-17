import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('focusDeskStorage', {
  getTheme: () => ipcRenderer.invoke('settings:get-theme'),
  setTheme: (theme: string) => ipcRenderer.invoke('settings:set-theme', theme),
  getSections: () => ipcRenderer.invoke('storage:get-sections'),
  createSection: (name: string, color: string) => ipcRenderer.invoke('storage:create-section', name, color),
  deleteSection: (sectionId: string) => ipcRenderer.invoke('storage:delete-section', sectionId),
  getTasks: () => ipcRenderer.invoke('storage:get-tasks'),
  setTasks: (tasks: unknown) => 
    ipcRenderer.invoke('storage:set-tasks', tasks),

  getSessions: () => ipcRenderer.invoke('storage:get-sessions'),
  setSessions: (sessions: unknown) =>
    ipcRenderer.invoke('storage:set-sessions', sessions)
})
