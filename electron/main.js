// electron/main.js
// Electron 主进程

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
// const isDev = require('electron-is-dev'); // 旧的, 会导致 ERR_REQUIRE_ESM 错误

// 修复: 我们将 createWindow 变为 async 函数来使用动态 import()
async function createWindow() {
  
  // 修复: 使用动态 import() 异步加载 ESM 模块
  const { default: isDev } = await import('electron-is-dev');

  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 加载 React 应用
  const appUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  win.loadURL(appUrl);

  // 在新窗口中打开所有外部链接
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 如果是开发模式，打开开发者工具
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

// 在 macOS 上，当所有窗口关闭时，除非用户退出，否则保持应用活跃
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
  // 重新创建一个窗口
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});