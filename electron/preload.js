// electron/preload.js
// 目前我们不需要任何特殊的 API 桥接，
// 所以这个文件可以很简单。
// 如果您未来需要 Electron 的 Node.js 功能（如读写文件），
// 您可以在这里通过 contextBridge 安全地暴露它们。

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // 示例：
  // openLink: (url) => ipcRenderer.send('open-external-link', url)
});

console.log('Term preload script loaded.');