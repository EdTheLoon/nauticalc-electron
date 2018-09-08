const electron = require("electron")
const {ipcRenderer} = electron;
const ul = document.querySelector("ul")

// Catch display:compass
ipcRenderer.on("display:compass", function(e, magnetic, deviation, devDir, corrected, variation, varDir, gyro, comErr, errDir) {
  var inner = "<li class='collection-item'>True:<span class='right'>" + gyro.toFixed(1) + "&deg;</span></li>"
  inner += "<li class='collection-item'>Variation:<span class='right'>" + variation.toFixed(1) + "&deg; " + varDir + "</span></li>"
  inner += "<li class='collection-item'>Magnetic:<span class='right'>" + corrected.toFixed(1) + "&deg;</span></li>"
  inner += "<li class='collection-item'>Deviation:<span class='right'>" + deviation.toFixed(1) + "&deg; " + devDir + "</span></li>"
  inner += "<li class='collection-item'>Compass:<span class='right'>" + magnetic.toFixed(1) + "&deg;</span></li>"
  inner += "<li class='collection-item'>Compass Error:<span class='right'>" + comErr.toFixed(1) + "&deg; " + errDir + "</span></li>" 
  ul.innerHTML = inner
})

// Catch display:gyro
ipcRenderer.on("display:gyro", function(e, gyro, latitude, latDir, LHA, declination, declDir, a, aDir, b, bDir, c, cDir, a3, az, azDir, gyroErr, errDir) {
  var inner = "<li class='collection-item'>Latitude:<span class='right'>" + latitude + " " + latDir + "</span</li>"
  inner += "<li class='collection-item'>LHA:<span class='right'>" + LHA + "</span</li>"
  inner += "<li class='collection-item'>Declination:<span class='right'>" + declination + " " + declDir + "</span</li>"
  inner += "<li class='collection-item'>Azimuth:<span class='right'>" + cDir + " " + a3.toFixed(1) + "&deg; " + azDir + "</span</li>"
  inner += "<li class='collection-item'>True:<span class='right'>" + az.toFixed(1) + "&deg;</span</li>"
  inner += "<li class='collection-item'>Gyro:<span class='right'>" + gyro + "&deg;</span</li>"
  inner += "<li class='collection-item'>Gyro Error:<span class='right'>" + gyroErr.toFixed(1) + "&deg; " + errDir + "</span</li>"
  ul.innerHTML = inner
})