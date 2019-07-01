const {app, BrowserWindow} = require('electron')
let win; 

function createWindow(){
    win = new BrowserWindow({
        width : 800, 
        height : 600,
        webPreferences: {
            nodeIntegration : true,
        }
    })
    
    win.loadFile('index.html')
    win.webContents.openDevTools()
    win.on('closed', ()=> {
        win = null
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', () =>{
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if(process.platform !='darwin'){
        app.quit()
    }
})
app.on('activate', ()=> {
    if(win == null){
        createWindow()
    }
})
