const { app, BrowserWindow,ipcMain, nativeTheme, Menu } = require('electron');
require('@electron/remote/main').initialize();


function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    const menuTemplate = [
        {
            label: ' file ',
            submenu: [
                {
                    label: 'new',
                    accelerator: 'CmdOrCtrl+N',
                    click: function() {
                        win.webContents.send('action', 'new');
                    }
                },
                {
                    label: 'open',
                    accelerator: 'CmdOrCtrl+O',
                    click: function() {
                        win.webContents.send('action', 'open');
                    }
                },
                {
                    label: 'save',
                    accelerator: 'CmdOrCtrl+S',
                    click: function() {
                        win.webContents.send('action', 'save');
                    }
                },
                {
                    label: 'save as...  ',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: function() {
                        win.webContents.send('action', 'save-as');
                    }
                },
                {
                    label: 'close',
                    click:function () {
                        win.webContents.send('action', 'close');
                    }
                }
            ]
        }
    ];
    let menu = Menu.buildFromTemplate (menuTemplate);
    Menu.setApplicationMenu (menu);
    //win.webContents.openDevTools();
    win.loadFile('index.html');
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    });
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
