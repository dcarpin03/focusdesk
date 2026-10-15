"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("focusDeskStorage", {
  getTasks: () => electron.ipcRenderer.invoke("storage:get-tasks"),
  setTasks: (tasks) => electron.ipcRenderer.invoke("storage:set-tasks", tasks),
  getSessions: () => electron.ipcRenderer.invoke("storage:get-sessions"),
  setSessions: (sessions) => electron.ipcRenderer.invoke("storage:set-sessions", sessions)
});
