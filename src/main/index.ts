import { app, BrowserWindow, ipcMain } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
import fs from 'fs';
import scheduler from 'node-schedule';
import path from 'path';
import parse from 'parse-duration';
// @ts-ignore
import parseDataURL from 'data-urls';
// @ts-ignore
import wifi from 'node-wifi'
import si from 'systeminformation'

const SLIDESHOW_DIRECTORY = 'C://users/coworking/documents/github/ozone/src/app/slideshows';

// let win:BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

ipcMain.on('getSafePath', (event, id, no, url) => {
  event.returnValue = getSafePath(id, no, url)
})

ipcMain.on('getSlideshowDirectory', (event) => {
  event.returnValue = path.resolve(SLIDESHOW_DIRECTORY)
})

function getSafePath(id:string, no:string, url:string){
  const slidePath = path.join (SLIDESHOW_DIRECTORY, id, no.toString())
  const resourcePath = path.join (slidePath, url)
  if (checkDir(slidePath, SLIDESHOW_DIRECTORY) === slidePath && checkDir(resourcePath, slidePath) === resourcePath)
    return 'file:///' + path.resolve(resourcePath)
  else
    return new Error('permission denied or invalid path')
}

ipcMain.handle('getAvailableSlideshows', async () => {
  return getAvailableSlideshows();
})
function getAvailableSlideshows(){
  return new Promise ((resolve) => {
    fs.readdir(SLIDESHOW_DIRECTORY, (_err, files) => {
      let paths:any[] = []
      for (let i in files) {
        const p = files[i]
        fs.access(path.join(SLIDESHOW_DIRECTORY, p, 'slideshow.json'), (err) => {
          paths[i] = err ? err : p
          let complete = true;
          for (let i2 = 0; i2 < files.length; i2++){
            if (paths[i2] == undefined){
              complete = false
            }
          }
          if (complete){
            let out = {
              success: [] as string[],
              err: [] as Error[]
            }
            for (let p of paths){
              if (typeof p == 'string'){
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

ipcMain.handle('getWiFiNetworks', async () => {
  return wifi.scan()
})

ipcMain.handle('connectWiFi', async (_event, ssid, password) => {
  return wifi.connect({ssid: ssid, password: password})
})

ipcMain.handle('getCurrentWiFiConnections', async() => {
  return wifi.getCurrentConnections()
})

ipcMain.handle('getNetworkInterfaceDefault', async() => {
  return si.networkInterfaceDefault();
})

ipcMain.on('parse', (event, str) => {
  event.returnValue = parse(str)
})

ipcMain.on('getDataBody', (event, str) => {
  event.returnValue = parseDataURL(str).body.toString()
})

function checkDir (fullPath:string, root:string=SLIDESHOW_DIRECTORY){
  const initPath = fullPath
  fullPath = path.join(fullPath)
  fullPath = path.resolve(fullPath)
  root = path.join(root)
  root = path.resolve(root)
  if (fullPath.startsWith(root)) {
    fullPath = fullPath.substring(root.length)
    if (fullPath.includes ('../') || fullPath === '..' || fullPath.includes('//')){
        return new Error('permission denied or invalid path')
    } else {
      return initPath
    }
  } else {
    return new Error('permission denied or invalid path')
  }
}

const createWindow = () => {

  const path = require('path')
  const os = require('os')
  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\5.3.3_0')
  );

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: false
    }
  });
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // win = mainWindow
};
wifi.init({
  iface: null
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
