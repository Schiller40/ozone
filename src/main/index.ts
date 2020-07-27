import { app, BrowserWindow, ipcMain, screen } from 'electron'
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
import fs from 'fs'
const fsP = fs.promises
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
import { Store, getJSON } from './util'
import Queue from 'bull'

const debug = debuglog('ozoneIndex')

// interface Slideshow {
//   id: string
//   spec_version: string
//   name: string
//   timing: {
//     start: string
//     duration: string
//   }[]
//   recipients: string[]
//   repeat: boolean
//   slides: Slide[]
//   lastModified: number
// }
// interface Slide {
//   name: string
//   duration: string
//   url: string
//   mime: string
//   repeat?: number
//   transition?: {
//     name: string
//     mode?: string
//   }
//   text?: string
// }

debug('starting index')

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
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  let slideshowQueue = new Queue('slideshows')
  slideshowQueue.process((job, done) => {
    addSlideshowToVisualStack(job.data.id, job.data.lastModified)
    setTimeout(() => {
      removeSlideshowFromVisualStack(job.data.id)
    }, parse(job.data.duration) + 5)
    done()
  })

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

// ipcMain.handle('getSlideshowDirectory', async () => {
//   return path.resolve(await store.get('root'))
// })
ipcMain.on('getLocalIP', (event) => {
  event.returnValue = getLocalIP()
})
ipcMain.on('isNetworkConnected', (event) => {
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
// ipcMain.on('getDataBody', (event, str) => {
//   event.returnValue = parseDataURL(str).body.toString()
// })
debug('ipc handlers initialized')

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
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

function getAvailableSlideshows(): Promise<{ success: string[]; err: Error[] }> {
  return new Promise(async (resolve) => {
    const root = await store.get('root')
    fs.readdir(root, (_err, files) => {
      let paths: (string | Error)[] = []
      for (let i in files) {
        const p = files[i]
        fs.access(path.join(root, p, 'slideshow.json'), (err) => {
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
