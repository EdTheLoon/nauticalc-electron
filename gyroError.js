const electron = require("electron")
const {ipcRenderer} = electron
require("./assets/js/nauticalclib.js")

// Gyro Error Form Handling
document.querySelector("#gyroErrorForm").addEventListener("submit", function (e){
  e.preventDefault()
  var txtLat = e.target.querySelector("#gyro_latitude").value
  var latitude = splitDegs(txtLat)
  var gyro = parseFloat(e.target.querySelector("#gyro_gyro").value)
  var latDir = e.target.querySelector("#gyro_latDir").text
  var txtLHA = e.target.querySelector("#gyro_LHA").value
  var LHA = splitDegs(txtLHA)
  var txtDec = e.target.querySelector("#gyro_declination").value
  var declination = splitDegs(txtDec)
  var declDir = e.target.querySelector("#gyro_declDir").text
  var a = 0.0
  var aDir = ""
  var b = 0.0
  var bDir = ""
  var c = 0.0
  var cDir = ""
  var a3 = 0.0
  var az = 0.0
  var azDir = ""
  var gyroErr = 0.0
  var errDir = ""

  // Parsing for display purposes
  txtLat = splitDegsTxt(txtLat)
  txtLHA = splitDegsTxt(txtLHA)
  txtDec = splitDegsTxt(txtDec)

  // DEBUG CODE. COMMENT OUT WHEN NOT NEEDED
  //alert("Gyro: " + gyro + "\nLatitude: " + latitude + " " + latDir + "\nLHA: " + LHA + "\nDeclination: " + declination + " " + declDir)

  // Start calculating A
  a = Math.abs(degs(Math.tan(rads(latitude))) / degs(Math.tan(rads(LHA))))
  if (LHA > 90.0 && LHA < 270.0) {
    aDir = latDir
  } else {
    aDir = opposite(latDir)
  }

  // Start calculating B
	b = Math.abs(degs(Math.tan(rads(declination))) / degs(Math.sin(rads(LHA))))
  bDir = declDir
  
  // Start calculating C
  if (aDir == bDir) {
    c = a + b
    cDir = aDir
  } else {
    c = Math.abs(a - b)
    var highest = Math.max(a, b)
    if (highest == a) {
      cDir = aDir
    } else {
      cDir = bDir
    }
  }

  // Start calculating a3
  var cCosLat = rads(c) * Math.cos(rads(latitude))
  a3 = rads(1) / cCosLat
  a3 = degs(Math.atan(a3))

  // Remove negative sign
  if (a3 < 0) {
    a3 = a3 - (a3 * 2)
  }

  // East or West
  if (LHA > 180.0 && LHA < 360.0) {
    azDir = "E"
  } else {
    azDir = "W"
  }

  // True Bearing
  if (cDir == "N") {
    if (azDir == "E") {
      az = 0 + a3
    } else {
      az = 360 - a3
    }
  } else {
    if (azDir == "E") {
      az = 180 - a3
    } else {
      az = 180 + a3
    }
  }

  // Start calculating the error
  gyroErr = az - gyro
  errDirArray = getDirectionHL(gyroErr)
  gyroErr = errDirArray[0]
  errDir = errDirArray[1]

  // Debug code
  console.log("A: " + a + " " + aDir)
  console.log("B: " + b + " " + bDir)
  console.log("C: " + c + " " + cDir)
  console.log("a3: " + cDir + " " + a3 + "&deg; " + azDir)
  console.log("Az: " + az)
  console.log("Gyro Error: " + gyroErr + " " + errDir)
    

  ipcRenderer.send("results:gyro", 300, 340, gyro, txtLat, latDir, txtLHA, txtDec, declDir, a, aDir, b, bDir, c, cDir, a3, az, azDir, gyroErr, errDir)
})

// Parses degrees and minutes input
function splitDegs(s) {
  var split = s.split("-")
  var degs = parseFloat(split[0])
  var mins = parseFloat(split[1]) / 60
  var newDegs = degs + mins
  return newDegs
}

// Parses degrees and minutes input for text display
function splitDegsTxt(s) {
  var split = s.split("-")
  var degsMins = split[0] + "° " + split[1] + "'"
  return degsMins
}

// Determines whether the passed in float is East or West then removes any negative
// sign. Returns a float and string
function getDirectionHL(v) {
	var d = ""
	if (v < 0) {
		d = "H"
		v = v - (v * 2)
	} else {
		d = "L"
	}
	return [v, d]
}

// Determines whether the passed in float is North or South then removes any negative
// sign. Returns a float and string
function getDirectionNS(v) {
  var d = ""
  if (v < 0) {
    d = "S"
    v = v - (v * 2)
  } else {
    d = "N"
  }
  return [v, d]
}

// Converts north into south and vice versa
function opposite(d) {
  if (d == "N") {
    d = "S"
  } else if (d == "S") {
    d = "N"
  } else if (d == "E") {
    d = "W"
  } else if (d == "W") {
    d = "E"
  }
  return d
}

// Converts a value from radians into degrees
function degs(r) {
  return r * 180 / Math.PI
}

// Converts a value from degrees into radians
function rads(d) {
  return d * Math.PI / 180
}