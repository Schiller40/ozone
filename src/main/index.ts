import { app, BrowserWindow, ipcMain, screen } from 'electron'
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
import fs from 'fs'
const fsP = fs.promises
// @ts-ignore
import wifi from 'node-wifi'
import si from 'systeminformation'
import os from 'os'
import { Container } from 'typedi'
import { debuglog } from 'util'

app.allowRendererProcessReuse = false

const debug = debuglog('ozoneIndex')

import(/* webpackChunkName: 'Anything' */ '../index2.js')

debug('starting index')

debug('set global debug helpers')

if (require('electron-squirrel-startup')) {
  app.quit()
}

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

ipcMain.on('getLocalIP', (event) => {
  event.returnValue = getLocalIP()
})
ipcMain.on('isNetworkConnected', (event) => {
  event.returnValue = getLocalIP() ? true : false
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
