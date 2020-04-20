import { ipcRenderer, IpcRenderer } from 'electron'

declare global {
    interface Window { ipcRenderer:IpcRenderer; }
}

window.ipcRenderer = ipcRenderer

console.log(window.ipcRenderer.sendSync('test', 'test'))
