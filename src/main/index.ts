import { app, BrowserWindow, ipcMain } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
import fs from 'fs';
import scheduler from 'node-schedule';
import path from 'path';

const SLIDESHOW_DIRECTORY = './src/app/slideshows';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

ipcMain.on('test', (event, arg) => {
  console.log(`Test message: ${arg}`)
  event.returnValue = 'Printed message successfully'
})

ipcMain.handle('getAvailableSlideshows', async () => {
  const promise = getAvailableSlideshows();
  return promise
})
function getAvailableSlideshows(){
  return new Promise ((resolve, reject) => {
    fs.readdir(SLIDESHOW_DIRECTORY, (_err, files) => {
      var counter = 0
      for (var i in files) {
        fs.access(path.join(SLIDESHOW_DIRECTORY, files[i], 'slideshow.json'), (err) => {
          if (err){
            reject(err);
          } else {
            counter++;
            if (counter == files.length) {
              console.log(files)
              resolve(files)
            }
          }
        })
      }
    })
  })
}

function checkDir (fullPath:string, root:string=SLIDESHOW_DIRECTORY){
  const initPath = fullPath
  fullPath = path.join(fullPath)
  fullPath = path.resolve(fullPath)
  console.log(`fullPath is ${fullPath}`)
  root = path.join(root)
  root = path.resolve(root)
  console.log(`root is ${root}`)
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

ipcMain.handle('getSlideshow', async(_event, id) => {
  const promise = getSlideshow(id);
  return promise
})
function getSlideshow(id:string){
  return new Promise((resolve, reject) => {
    const JSONPath = path.join(SLIDESHOW_DIRECTORY, id, 'slideshow.json')
    if (id.length == 64 && checkDir(JSONPath)){
      fs.readFile(JSONPath, (err, result) => {
        if (err) reject(err)
        else resolve(JSON.parse(result.toString()))
      })
    } else {
      reject(new Error('permission denied or invalid path'))
    }
  })
}

ipcMain.handle('getResource', async(_event, id, no, url) => {
  const promise = getResource(id, no, url);
  return promise
})
function getResource(id:string, no:number, url:string){
  return new Promise((resolve, reject) => {
    const slidePath = path.join(SLIDESHOW_DIRECTORY, id, no.toString())
    const resourcePath = path.join(slidePath, url)
    if (checkDir(slidePath, SLIDESHOW_DIRECTORY) === slidePath && checkDir(resourcePath, slidePath) === resourcePath){
      fs.readFile(resourcePath, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    } else {
      reject(new Error('permission denied or invalid path'))
    }
  })
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
    }
  });
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

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
