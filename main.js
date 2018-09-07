const electron = require("electron")
const url = require("url")
const path = require("path")

const {app, BrowserWindow, globalShortcut, Menu, ipcMain} = electron
let mainWindow
let resultsWindow

// Uncomment for development mode or production mode
// process.env.NODE_ENV = "development"
process.env.NODE_ENV = "production"

// Initialise the app. Create windows.
app.on("ready", createMainWindow)

// CREATE WINDOW FUNCTON
function createMainWindow() {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    show: false
  })
  // Load HTML file into window
  // Loaded path = file://dirname/mainWindow.html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "mainWindow.html"),
    protocol: "file:",
    slashes: true
  }))

  // Remove the default menu
  Menu.setApplicationMenu(null)

  // Assign Ctrl+R to reload the page if in developer mode
  if (process.env.NODE_ENV != "production") {
    globalShortcut.register("F5", function() {
      mainWindow.reload()
    })
    globalShortcut.register("CommandOrControl+R", function() {
      mainWindow.reload()
    })

    // Assign Ctrl+Shift+I to toggle Dev Tools
    globalShortcut.register("CommandOrControl+Shift+I", function () {
      mainWindow.toggleDevTools()
    })
  }

  // Show the window once everything is loaded and good to go
  mainWindow.once("ready-to-show", function() {
    mainWindow.show()
  })

  // Quit app when main window is closed
  mainWindow.on("closed", function() {
    app.quit()
  })
}

// CREATE RESULTS WINDOW FUNCTION
function createResultsWindow(_width, _height) {
    // Create new window
    resultsWindow = new BrowserWindow({
      width: _width,
      height: _height
    })
    // Load HTML file into window
    // Loaded path = file://dirname/resultsWindow.html
    resultsWindow.loadURL(url.format({
      pathname: path.join(__dirname, "resultsWindow.html"),
      protocol: "file:",
      slashes: true
    }))
  
    // Remove the default menu
    Menu.setApplicationMenu(null)
    
    // Garbage collection
    resultsWindow.on("close", function() {
      resultsWindow = null
    })
}

// This code executes when ipcMain receives data on the 'results:compass' channel
function handleResultsCompass(e, w, h, magnetic, deviation, devDir, corrected, variation, varDir, gyro, comErr, errDir) {
  createResultsWindow(w, h)
  // Use an event handler to make sure we don't send the data before the results window has loaded
  resultsWindow.webContents.once("did-finish-load", function(e) {
    resultsWindow.webContents.send("display:compass", magnetic, deviation, devDir, corrected, variation, varDir, gyro, comErr, errDir)
  })
}

// This code executes when ipcMain receives data on the 'results:gyro' channel
function handleResultsGyro(e, w, h, gyro, latitude, latDir, LHA, declination, declDir, a, aDir, b, bDir, c, cDir, a3, az, azDir, gyroErr, errDir) {
  createResultsWindow(w, h)
  // Use an event handler to make sure we don't send the data before the results window has loaded
  resultsWindow.webContents.once("did-finish-load", function(e) {
    resultsWindow.webContents.send("display:gyro", gyro, latitude, latDir, LHA, declination, declDir, a, aDir, b, bDir, c, cDir, a3, az, azDir, gyroErr, errDir)
  })
}

// Add an event listener to handle our forms being submitted
ipcMain.on("results:compass", handleResultsCompass)
ipcMain.on("results:gyro", handleResultsGyro)