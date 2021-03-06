const electron = require("electron")
const url = require("url")
const path = require("path")

const {app, BrowserWindow, globalShortcut, Menu, ipcMain} = electron
let mainWindow
let resultsWindow

// Uncomment for development mode. Comment for production mode
// process.env.NODE_ENV = "development"

// Windows needs some slightly different sizes. Set true if building for windows
TARGET_WIN = true

// Initialise the app. Create windows.
app.on("ready", createMainWindow)

// CREATE WINDOW FUNCTON
function createMainWindow() {
  // Create new window
  if (TARGET_WIN == true) {
    _w = 450
    _h = 680
  } else {
    _w = 450
    _h = 600
  }
  mainWindow = new BrowserWindow({
    width: _w,
    height: _h,
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
    if (TARGET_WIN == false) {
      resultsWindow = new BrowserWindow({
        width: _width,
        height: _height,
        show: false
      })
    } else {
      resultsWindow = new BrowserWindow({
        width: _width,
        height: _height + 60,
        show: false
      })
    }
    // Load HTML file into window
    // Loaded path = file://dirname/resultsWindow.html
    resultsWindow.loadURL(url.format({
      pathname: path.join(__dirname, "resultsWindow.html"),
      protocol: "file:",
      slashes: true
    }))
  
    // Remove the default menu
    Menu.setApplicationMenu(null)

    // Show the window once everything is loaded and good to go
    resultsWindow.once("ready-to-show", function() {
      resultsWindow.show()
    })
    
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