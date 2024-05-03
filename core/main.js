const { app, BrowserWindow, ipcMain, dialog } = require('electron');  
const url = require('url');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    // icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  //load the index.html from a url
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'resources/browser/index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // win.loadFile(`../../../dist/apps/electron-angular-ui/index.html`);

  // Open the DevTools.
  // win.webContents.openDevTools();

  // open maximized
  win.maximize()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// ngElectron Desktop core functions

// Sample function
ipcMain.handle('welcome', (event, name) => {
  notificationShow({body: name});
  return `Hello ${name}!`;
});

// Open File Dialog
ipcMain.handle('dialog:open', async (_, args) => {
  const result = await dialog.showOpenDialog({
    filters: [{
      name: 'ngElectron Files',
      extensions: ['ts', 'js']
    }],
    properties: ['openFile']
  });
  return result;
});

// Save File Dialog
ipcMain.handle('dialog:save', async (eventData, content) => {
  const result = await dialog.showSaveDialog({
    filters: [{
      name: 'ngElectron Files',
      extensions: ['txt']
    }],
    properties: ['createDirectory']
  });

  if(!result.canceled) {
    // notificationShow({body: result.filePath});
    try {
      fs.writeFileSync(result.filePath, content);
      notificationShow({body: `File saved to ${result.filePath}`});
    } catch (err) {
      notificationShow({body: err});
    }
  }

  return result;
});

// Check versions
ipcMain.handle('cmd', async(_, args) => {
  try {
    const child = spawn(args['cmd'], args['param']);
    let output = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Child process exited with code ${code}`));
        }
      });

      child.stderr.on('data', (data) => {
        reject(new Error(`Error in child process: ${data.toString()}`));
      });
    });

    return output.trim();
  } catch (error) {
    console.error('Error retrieving Node version:', error.message);
    throw error; // Re-throw to propagate the error to the caller
  }
});

// Notification Service
function notificationShow({...args}) {
  const { Notification } = require('electron');

  const notify = new Notification({
    title: args['title'],
    subtitle: args['subtitle'],
    body: args['body'],
  });
  notify.show();
}