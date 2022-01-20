const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow = null;
// 建立應用程式視窗的 function
function createWindow () {
  // 應用程式視窗設定
  mainWindow = new BrowserWindow({
    width: 1123,
    height: 794,
    webPreferences: {
      // 載入 preload.js
      //preload: path.join(__dirname, 'preload.js')
        nodeIntegration: true , 
        //enableRemoteModule: true,
        contextIsolation: false
    }
  })

  // 載入 index.html，亦可載入某個網址
  mainWindow.loadFile('index.html')
  // 打開開發者模式
  mainWindow.webContents.openDevTools()
}

// 完成初始化後執行此方法
app.whenReady().then(() => {
  createWindow()

})

// 關閉所有視窗時觸發，除 macOS 以外
app.on('window-all-closed', function () {
    app.quit()
})