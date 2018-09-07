const electron = require("electron")
const {ipcRenderer} = electron

// Compass Error Form Handling
document.querySelector("#calcErrorForm").addEventListener("submit", function (e){
  e.preventDefault()
  var magnetic = parseFloat(e.target.querySelector("#cmp_magnetic").value)
  var gyro = parseFloat(e.target.querySelector("#cmp_gyro").value)
  var variation = parseFloat(e.target.querySelector("#cmp_variation").value)
  var varDir = e.target.querySelector("#cmp_varDir").text
  var corrected = 0.0
  var deviation = 0.0
  var devDir = ""
  var comErr = 0.0
  var errDir = ""

  // DEBUG CODE. COMMENT OUT WHEN NOT NEEDED
  //alert("Magnetic: " + magnetic + "\nGyro: " + gyro + "\nVariation: " + variation + " " + varDir)

  // Start calculating
  if (varDir == "W") {
    corrected = gyro + variation
  } else {
    corrected = gyro - variation
  }

  deviation = corrected - magnetic
  comErr = magnetic - gyro

  devArray = getDirectionEW(deviation)
  deviation = devArray[0]
  devDir = devArray[1]

  comErrArray = getDirectionEW(comErr)
  comErr = comErrArray[0]
  errDir = comErrArray[1]

  ipcRenderer.send("results:compass", 250, 300, magnetic, deviation, devDir, corrected, variation, varDir, gyro, comErr, errDir)
})

// Determines whether the passed in float is East or West then removes any negative
// sign. Returns a float and string
function getDirectionEW(v) {
	var d = ""
	if (v < 0) {
		d = "W"
		v = v - (v * 2)
	} else {
		d = "E"
	}
	return [v, d]
}
