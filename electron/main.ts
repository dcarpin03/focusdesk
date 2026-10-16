import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import { store } from './store'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

ipcMain.handle('storage:get-tasks', () => {
  return store.get('tasks')
})

ipcMain.handle('storage:set-tasks', (_event, tasks) => {
  store.set('tasks', tasks)
})

ipcMain.handle('storage:get-sessions', () => {
  return store.get('sessions')
})

ipcMain.handle('storage:set-sessions', (_event, sessions) => {
  store.set('sessions', sessions)
})

ipcMain.handle('storage:get-sections', () => store.get('sections'))

ipcMain.handle('storage:create-section', (_event, name: string) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('El nombre de la sección es obligatorio.')
  }

  const sections = store.get('sections')
  const trimmedName = name.trim()
  if (sections.some((section) => section.name.toLocaleLowerCase() === trimmedName.toLocaleLowerCase())) {
    throw new Error('Ya existe una sección con ese nombre.')
  }

  const section = { id: randomUUID(), name: trimmedName }
  store.set('sections', [...sections, section])
  return section
})

ipcMain.handle('storage:delete-section', (_event, sectionId: string) => {
  if (store.get('sessions').some((session) => session.sectionId === sectionId)) {
    throw new Error('Solo se pueden eliminar secciones vacías.')
  }

  store.set('sections', store.get('sections').filter((section) => section.id !== sectionId))
})

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
