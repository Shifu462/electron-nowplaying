import Vue from 'vue-class-component'
import VueElectron from 'vue-electron'

//Vue.use(VueElectron);
(Vue as any).prototype.$electron = require('electron');

import { app, BrowserWindow } from 'electron';
import SteamSettingsManager from './SteamSettingsManager';




const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (!isDevelopment) {
    (global as any).__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow: any;
const applicationUrl = isDevelopment
                    ? `http://localhost:9080`
                    : `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 500,
        useContentSize: true,
        width: 1000,
        frame: false,
        //transparent: true,
    });

    if (isDevelopment) {
        mainWindow.webContents.openDevTools()
    }
    
    mainWindow.on('closed', () => mainWindow = null);

    let steamSettings = SteamSettingsManager.getSettings();
    console.log(steamSettings);

    mainWindow.loadURL(applicationUrl);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
