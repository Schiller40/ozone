import { app, BrowserWindow, ipcMain, screen } from 'electron'
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
import fs from 'fs'
const fsP = fs.promises
// @ts-ignore
import wifi from 'node-wifi'
import si from 'systeminformation'
import os from 'os'
import { debuglog } from 'util'
import Redis from 'ioredis'
import parse from 'parse-duration'

const redis = new Redis()
const redis2 = new Redis()
redis.subscribe('slideshows', (err, res) => {
  if (err) console.log(err)
  else console.log(res)
})

app.allowRendererProcessReuse = false

const debug = debuglog('ozoneIndex')

debug('starting index')

debug('set global debug helpers')

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = () => {
  const path = require('path')
  if (os.platform() == 'win32')
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

  redis.on('message', (channel, message) => {
    console.log(`received ${message} on ${channel}`)
    const data: {
      id: string
      duration: string
      lastModified: string
    } = JSON.parse(message)
    addSlideshowToVisualStack(data.id, Date.parse(data.lastModified))
    console.log(data)
    console.log(Date.parse(data.lastModified))
    setTimeout(() => {
      removeSlideshowFromVisualStack(data.id)
    }, parse(data.duration))
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

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
ipcMain.handle('getDefaultNetworkInterface', async () => {
  return si.networkInterfaceDefault()
})
ipcMain.handle('setDeviceDetails', async () => {})
ipcMain.handle(
  'setOzoneNetwork',
  async (_event, newNetwork: { name: string; password: string }) => {
    if (!newNetwork || !newNetwork.name || !newNetwork.password)
      return 'Bitte Netzwerknamen und Passwort eingeben'
    if (newNetwork.password.length < 8) return 'Passwort zu kurz. Mindestens 8 Zeichen notwendig'
    if (
      newNetwork.password.toUpperCase().match(/.*S.*U.*P.*P.*E.*N.*K.*A.*S.*P.*E.*R.*/) ||
      newNetwork.password.toUpperCase().match(/.*S.*C.*H.*N.*U.*R.*Z.*W.*U.*M.*P.*E.*/)
    )
      return "<code style='font-family:monospace'>Checking for vulnerabilities...<br>Found 3 vulnerabilities<br>#0 Connected account 'schiller40.coworkingspace@gmail.com' uses a similar password.<br>#1 Connected account 'repaircafe.wolfsburg@gmx.de' uses a similar password.<br>#2 WiFi-Network 'Markthalle' uses a similar password.<br>Reporting 3 vulnerabilities to hackinggermancompanies.in... Done!<br>Clearing command line so traces are gone<br>root@SCHILLER40-DESKTOP:~# clear<br>&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_______&nbsp;_____&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;_____&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;______&nbsp;_____&nbsp;_______&nbsp;<br>&nbsp;\\&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/_&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;__&nbsp;\\| |&nbsp;&nbsp;| |/&nbsp;____|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/\\&nbsp;&nbsp;&nbsp;| |&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;____|&nbsp;&nbsp;__&nbsp;\\__&nbsp;&nbsp;&nbsp;__|<br>&nbsp;&nbsp;\\&nbsp;\\&nbsp;&nbsp;/&nbsp;/&nbsp;&nbsp;| | | |__)&nbsp;| |&nbsp;&nbsp;| | (___&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;\\&nbsp;&nbsp;| |&nbsp;&nbsp;&nbsp;&nbsp;| |__&nbsp;&nbsp;| |__)&nbsp;| | |&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;\\&nbsp;\\/&nbsp;/&nbsp;&nbsp;&nbsp;| | |&nbsp;&nbsp;_&nbsp;&nbsp;/| |&nbsp;&nbsp;| |\\___&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/\\&nbsp;\\&nbsp;| |&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;__| |&nbsp;&nbsp;_&nbsp;&nbsp;/&nbsp;&nbsp;| |&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;\\&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;_| |_| | \\&nbsp;\\| |__| |____)&nbsp;|&nbsp;&nbsp;/&nbsp;____&nbsp;\\| |____| |____| | \\&nbsp;\\&nbsp;&nbsp;| |&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\/&nbsp;&nbsp;&nbsp;|_____|_|&nbsp;&nbsp;\\_\\\\____/|_____/&nbsp;&nbsp;/_/&nbsp;&nbsp;&nbsp;&nbsp;\\_\\______|______|_|&nbsp;&nbsp;\\_\\&nbsp;|_|</code><br><br>An unknown error occured inside ozone. Try using a unique password."
    if (newNetwork.password.toUpperCase().match(/.*P.*A.*S.*S.*W.*O.*R.*[DT].*/))
      return 'Selten ein so erbärmliches Passwort gesehen...'
    if (
      !newNetwork.password.match(/.*[A-Z].*/) ||
      !newNetwork.password.match(/.*[a-z].*/) ||
      !newNetwork.password.match(/.*\d.*/) ||
      !newNetwork.password.match(/.*[^A-Za-z\d].*/)
    )
      return 'Passwort muss mindestens je eine/n Groß-, Kleinbuchstaben, Ziffer, Sonderzeichen enthalten'
    try {
      const res = await redis2.set('network', JSON.stringify(newNetwork))
      if (res === 'OK') {
        return 'ok'
      } else {
        return 'error while setting network in redis'
      }
    } catch (err) {
      throw err
    }
  }
)
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
