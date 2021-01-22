const {app, BrowserWindow, ipcMain} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require('electron-updater');

let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
  log.info(win.webContents);
}

function createWindow () {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.on('closed', () => { win = null; });

  win.webContents.openDevTools();

  win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);

  win.webContents.on('did-finish-load', function(){
    win.webContents.send('message', 'Pré verificação parte 2');
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow)

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    //createWindow()
    sendStatusToWindow('WOLOLO');
  }
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
  console.log('Update available');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
  console.log('Error in autpUpdate');
})