"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("focusDeskStorage", {
  getSections: () => electron.ipcRenderer.invoke("storage:get-sections"),
  createSection: (name, color) => electron.ipcRenderer.invoke("storage:create-section", name, color),
  deleteSection: (sectionId) => electron.ipcRenderer.invoke("storage:delete-section", sectionId),
  getTasks: () => electron.ipcRenderer.invoke("storage:get-tasks"),
  setTasks: (tasks) => electron.ipcRenderer.invoke("storage:set-tasks", tasks),
  getSessions: () => electron.ipcRenderer.invoke("storage:get-sessions"),
  setSessions: (sessions) => electron.ipcRenderer.invoke("storage:set-sessions", sessions)
});
