const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('soliasCoreService', {
    welcome: (name) => ipcRenderer.invoke('welcome', name),
    openDialog: async () => ipcRenderer.invoke('dialog:open'),
    saveDialog: async (fileData) => ipcRenderer.invoke('dialog:save', fileData),
    cmd: async (args) => ipcRenderer.invoke('cmd', args)
});