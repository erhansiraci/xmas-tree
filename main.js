const { app, BrowserWindow, Menu, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Get the primary display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Widget takes 1/16 of screen (1/4 width x 1/4 height)
  const widgetWidth = Math.floor(screenWidth / 4);
  const widgetHeight = Math.floor(screenHeight / 4);

  // Position at bottom-right with small margin
  const margin = 20;
  const x = screenWidth - widgetWidth - margin;
  const y = screenHeight - widgetHeight - margin;

  mainWindow = new BrowserWindow({
    width: widgetWidth,
    height: widgetHeight,
    x: x,
    y: y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Set always on top with higher level for Windows
  // 'floating' level keeps widget above normal windows on Windows
  mainWindow.setAlwaysOnTop(true, 'floating');

  // Reapply on focus to handle Windows edge cases
  mainWindow.on('blur', () => {
    mainWindow.setAlwaysOnTop(true, 'floating');
  });

  // Send screen dimensions to renderer for responsive canvas
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('screen-size', { width: widgetWidth, height: widgetHeight });
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development (uncomment for debugging)
  // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
