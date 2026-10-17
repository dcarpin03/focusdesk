import { app, BrowserWindow, dialog, ipcMain, nativeImage, protocol } from 'electron'
import { randomUUID } from 'node:crypto'
import { readFile, writeFile, stat, mkdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import { store } from './store'
import type { BackgroundResult } from '../src/types'

const MAX_BYTES = 10 * 1024 * 1024
const MAX_PIXELS = 30_000_000
const validReference = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(value)
const directory = () => path.join(app.getPath('userData'), 'backgrounds')
const imagePath = (reference: string) => path.join(directory(), reference)
const imageUrl = (reference: string) => `focusdesk-background://image/current?id=${reference}`
let busy = false

class InvalidImage extends Error {}

protocol.registerSchemesAsPrivileged([{ scheme: 'focusdesk-background', privileges: { standard: true, secure: true, supportFetchAPI: true } }])

function imageType(bytes: Buffer) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { extension: 'png', mime: 'image/png' }
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return { extension: 'jpg', mime: 'image/jpeg' }
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return { extension: 'webp', mime: 'image/webp' }
  throw new InvalidImage('Selecciona una imagen JPG, PNG o WebP válida.')
}

async function webpSize(bytes: Buffer): Promise<{ width: number; height: number }> {
  // nativeImage in Electron 30 cannot decode WebP. Chromium can, without file access.
  const decoder = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } })
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    await decoder.loadURL('data:text/html,<meta http-equiv="Content-Security-Policy" content="default-src %27none%27; img-src data:">')
    const source = JSON.stringify(`data:image/webp;base64,${bytes.toString('base64')}`)
    return await Promise.race([
      decoder.webContents.executeJavaScript(`new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight }); image.onerror = () => reject(new Error('Invalid WebP')); image.src = ${source}; })`),
      new Promise<never>((_resolve, reject) => { timeout = setTimeout(() => reject(new InvalidImage('No se pudo validar la imagen WebP.')), 10000) })
    ])
  } finally {
    clearTimeout(timeout)
    decoder.destroy()
  }
}

async function validate(bytes: Buffer) {
  if (bytes.length > MAX_BYTES) throw new InvalidImage('La imagen no puede superar 10 MB.')
  const type = imageType(bytes)
  let size: { width: number; height: number }
  try {
    size = type.extension === 'webp' ? await webpSize(bytes) : nativeImage.createFromBuffer(bytes).getSize()
  } catch {
    throw new InvalidImage('La imagen está dañada o no se puede abrir.')
  }
  if (!size.width || !size.height) throw new InvalidImage('La imagen está dañada o no se puede abrir.')
  if (size.width * size.height > MAX_PIXELS) throw new InvalidImage('La imagen no puede superar 30 megapíxeles.')
  return type
}

async function readImage(reference: string) {
  const file = imagePath(reference)
  const info = await stat(file)
  if (!info.isFile() || info.size > MAX_BYTES) throw new InvalidImage('Imagen no disponible.')
  const bytes = await readFile(file)
  const type = await validate(bytes)
  return { bytes, ...type }
}

async function currentBackground(): Promise<BackgroundResult> {
  const reference = store.get('backgroundImage')
  if (reference === null || reference === undefined) return { url: null }
  if (validReference(reference)) {
    try {
      await readImage(reference)
      return { url: imageUrl(reference) }
    } catch { /* Fall back without changing any saved study data. */ }
  }
  return { url: null, error: 'El fondo guardado no está disponible. Se utiliza el predeterminado.' }
}

async function removeCopy(reference: unknown) {
  if (validReference(reference)) await unlink(imagePath(reference)).catch(() => undefined)
}

export function registerBackgroundHandlers() {
  protocol.handle('focusdesk-background', async (request) => {
    const url = new URL(request.url)
    const reference = store.get('backgroundImage')
    if (request.method !== 'GET' || url.hostname !== 'image' || url.pathname !== '/current' || !validReference(reference) || url.searchParams.get('id') !== reference) return new Response(null, { status: 404 })
    try {
      const image = await readImage(reference)
      return new Response(new Uint8Array(image.bytes), { headers: { 'Content-Type': image.mime, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
    } catch { return new Response(null, { status: 404 }) }
  })
  ipcMain.handle('background:get', () => currentBackground())
  ipcMain.handle('background:import', async (event): Promise<BackgroundResult> => {
    if (busy) return { ...await currentBackground(), error: 'Espera a que termine el cambio de fondo.' }
    busy = true
    let newReference: string | undefined
    try {
      const parent = BrowserWindow.fromWebContents(event.sender)
      if (!parent) throw new Error('No window')
      const selection = await dialog.showOpenDialog(parent, { title: 'Elegir fondo ambiental', properties: ['openFile'], filters: [{ name: 'Imágenes (máximo 10 MB)', extensions: ['jpg', 'jpeg', 'png', 'webp'] }] })
      if (selection.canceled || !selection.filePaths[0]) return await currentBackground()
      const source = selection.filePaths[0]
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(source).toLowerCase())) throw new InvalidImage('Selecciona una imagen JPG, PNG o WebP.')
      const info = await stat(source)
      if (!info.isFile() || info.size > MAX_BYTES) throw new InvalidImage('Selecciona un archivo de imagen de hasta 10 MB.')
      const bytes = await readFile(source)
      const type = await validate(bytes)
      const oldReference = store.get('backgroundImage')
      newReference = `${randomUUID()}.${type.extension}`
      await mkdir(directory(), { recursive: true })
      await writeFile(imagePath(newReference), bytes, { flag: 'wx' })
      store.set('backgroundImage', newReference)
      const url = imageUrl(newReference)
      newReference = undefined
      await removeCopy(oldReference)
      return { url }
    } catch (error) {
      await removeCopy(newReference)
      return { ...await currentBackground(), error: error instanceof InvalidImage ? error.message : 'No se pudo importar el fondo. Inténtalo de nuevo.' }
    } finally { busy = false }
  })
  ipcMain.handle('background:reset', async (): Promise<BackgroundResult> => {
    if (busy) return { ...await currentBackground(), error: 'Espera a que termine el cambio de fondo.' }
    busy = true
    try {
      const reference = store.get('backgroundImage')
      store.set('backgroundImage', null)
      await removeCopy(reference)
      return { url: null }
    } catch { return { ...await currentBackground(), error: 'No se pudo restablecer el fondo.' } }
    finally { busy = false }
  })
}
