const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`File://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, data) => {
    mainWindow.webContents.send('todo:add', data);
    addWindow.close();
});

const menuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'New Todo',
            accelerator: process.platform === 'darwin' ? 'Command + T' : 'Ctrl + T',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear All Todos',
            accelerator: process.platform === 'darwin' ? 'Command + E' : 'Ctrl + E',
            click() {
                // clearAllTodos();
                mainWindow.webContents.send('todo:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Command + Q' : 'Ctrl + Q',
            click() {
                app.quit();
            }
        }
    ]
}];


if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo',
        webPreferences: {
            nodeIntegration: true
        }
    });
    addWindow.loadURL(`file:/${__dirname}/addTodo.html`);
    addWindow.on('closed', () => addWindow = null);
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command + Alt + I' : 'Ctrl + Shift + I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}