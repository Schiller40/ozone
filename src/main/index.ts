import { app, BrowserWindow, ipcMain, screen } from 'electron'
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
import fs from 'fs'
const fsP = fs.promises
import scheduler from 'node-schedule'
import path from 'path'
import parse from 'parse-duration'
// @ts-ignore
import parseDataURL from 'data-urls'
// @ts-ignore
import wifi from 'node-wifi'
import si from 'systeminformation'
import os from 'os'
import Redis from 'ioredis'
import { Container } from 'typedi'
import { debuglog } from 'util'
import { Store } from './util'

const debug = debuglog('ozoneIndex')

interface Slideshow {
  id: string
  spec_version: string
  name: string
  timing: {
    start: string
    duration: string
  }[]
  recipients: string[]
  repeat: boolean
  slides: Slide[]
  lastModified: number
}
interface Slide {
  name: string
  duration: string
  url: string
  mime: string
  repeat?: number
  transition?: {
    name: string
    mode?: string
  }
  text?: string
}
interface VisualStackEntry {
  lastModified: number
  id: string
}

debug('starting index')

// let priorityStack: string[] = []

// @ts-ignore
global.ipcMain = ipcMain
// @ts-ignore
global.path = path
// @ts-ignore
global.wifi = wifi
// @ts-ignore
global.si = si
// @ts-ignore
global.scheduler = scheduler
// @ts-ignore
global.os = os

debug('set global debug helpers')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const redis = new Redis()
Container.set('redis', redis)
debug('redis initialized')

const store = new Store(redis)

const createWindow = () => {
  const path = require('path')
  const os = require('os')
  BrowserWindow.addDevToolsExtension(
    path.join(
      os.homedir(),
      'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\5.3.3_0'
    )
  )

  const screens = screen.getAllDisplays()

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    x: screens[1].workArea.x + 100,
    y: screens[1].workArea.y + 100,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false
    }
  })
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  console.log(MAIN_WINDOW_WEBPACK_ENTRY)

  createPriorityStack()
    .then(slideshows => {
      slideshows.forEach(element => {
        initSlideshow(element.id, element.lastModified, element.timing[0].start, element.timing[0].duration)
        console.log(`scheduled ${element.name} for the following cron timestamps: ${element.timing[0].start}`)
      })
    })
    .catch(e => {
      console.log(e)
    })

  function initSlideshow(id: string, lastModified: number, cron: string, dur: string) {
    scheduler.scheduleJob(id, cron, () => {
      addSlideshowToVisualStack(id, lastModified)
      setTimeout(() => {
        removeSlideshowFromVisualStack(id)
      }, parse(dur) + 5)
    })
  }

  function addSlideshowToVisualStack(id: string, lastModified: number, play?: boolean) {
    mainWindow.webContents.send('addToVisualStack', id, lastModified, play)
  }

  function removeSlideshowFromVisualStack(id: string, play?: boolean) {
    mainWindow.webContents.send('removeFromVisualStack', id, play)
  }
}

wifi.init({
  iface: null
})
debug('wifi initialized')

ipcMain.handle('getSafePath', async (event, id, no, url) => {
  return getSafePath(id, no, url)
})

ipcMain.handle('getSlideshowDirectory', async () => {
  return path.resolve(await store.get('root'))
})

ipcMain.on('getLocalIP', event => {
  event.returnValue = getLocalIP()
})

ipcMain.on('isNetworkConnected', event => {
  event.returnValue = getLocalIP() ? true : false
})

ipcMain.handle('getAvailableSlideshows', async () => {
  return getAvailableSlideshows()
})

ipcMain.handle('getWiFiNetworks', async () => {
  return wifi.scan()
})

ipcMain.handle('connectWiFi', async (_event, ssid, password) => {
  return wifi.connect({ ssid: ssid, password: password })
})

ipcMain.handle('getCurrentWiFiConnections', async () => {
  return wifi.getCurrentConnections()
})

ipcMain.handle('getNetworkInterfaceDefault', async () => {
  return si.networkInterfaceDefault()
})

ipcMain.handle('getNetworkInterfaces', async () => {
  return si.networkInterfaces()
})

ipcMain.on('parse', (event, str) => {
  event.returnValue = parse(str)
})

ipcMain.on('getDataBody', (event, str) => {
  event.returnValue = parseDataURL(str).body.toString()
})
debug('ipc handlers initialized')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
debug('app handlers initialized')

function getLocalIP() {
  let interfaces = os.networkInterfaces()
  let addresses = []
  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      var address = interfaces[k][k2]
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address)
      }
    }
  }
  console.log(addresses)
  return addresses[0]
}

async function getSafePath(id: string, no: string, url: string) {
  const root = await store.get('root')
  const slidePath = path.join(root, id, no.toString())
  const resourcePath = path.join(slidePath, url)
  if ((await checkDir(slidePath, root)) === slidePath && (await checkDir(resourcePath, slidePath)) === resourcePath)
    return 'file:///' + path.resolve(resourcePath)
  else return new Error('permission denied or invalid path')
}
function getAvailableSlideshows(): Promise<{ success: string[]; err: Error[] }> {
  return new Promise(async resolve => {
    const root = await store.get('root')
    fs.readdir(root, (_err, files) => {
      let paths: (string | Error)[] = []
      for (let i in files) {
        const p = files[i]
        fs.access(path.join(root, p, 'slideshow.json'), err => {
          paths[i] = err ? err : p
          let complete = true
          for (let i2 = 0; i2 < files.length; i2++) {
            if (paths[i2] == undefined) {
              complete = false
            }
          }
          if (complete) {
            let out = {
              success: [] as string[],
              err: [] as Error[]
            }
            for (let p of paths) {
              if (typeof p == 'string') {
                out.success.push(p)
              } else {
                out.err.push(p)
              }
            }
            resolve(out)
          }
        })
      }
    })
  })
}

function createPriorityStack(): Promise<Slideshow[]> {
  return new Promise(async (resolve, reject) => {
    let slideshowIds = (await getAvailableSlideshows()).success
    let promises: Promise<Slideshow>[] = []
    for (const index in slideshowIds) {
      promises[parseInt(index)] = getJSON(path.join(await store.get('root'), slideshowIds[index], 'slideshow.json'))
    }
    Promise.all(promises)
      .then(slideshows => {
        // priorityStack = slideshows.sort((a, b) => (a.lastModified > b.lastModified ? 1 : -1)).map(obj => obj.id)
        resolve(slideshows)
      })
      .catch(e => {
        reject(e)
      })
  })
}

function getJSON(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fsP
      .readFile(path)
      .then(data => {
        resolve(JSON.parse(data.toString()))
      })
      .catch(e => {
        reject(e)
      })
  })
}

async function checkDir(fullPath: string, root?: string) {
  if (!root) root = await store.get('root')
  const initPath = fullPath
  fullPath = path.join(fullPath)
  fullPath = path.resolve(fullPath)
  root = path.join(root)
  root = path.resolve(root)
  if (fullPath.startsWith(root)) {
    fullPath = fullPath.substring(root.length)
    if (fullPath.includes('../') || fullPath === '..' || fullPath.includes('//')) {
      return new Error('permission denied or invalid path')
    } else {
      return initPath
    }
  } else {
    return new Error('permission denied or invalid path')
  }
}
