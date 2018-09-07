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