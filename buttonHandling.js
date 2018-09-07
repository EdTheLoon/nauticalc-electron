function opposite(e) {
  var _dir = e.target.text
  if (_dir == "N") {
    e.target.text = "S"
  } else if (_dir == "S") {
    e.target.text = "N"
  } else if (_dir == "E") {
    e.target.text = "W"
  } else if (_dir == "W") {
    e.target.text = "E"
  } else {
    e.target.text = "ERROR!"
  }
}

document.querySelector("#cmp_varDir").addEventListener("click", opposite)
document.querySelector("#gyro_latDir").addEventListener("click", opposite)
document.querySelector("#gyro_declDir").addEventListener("click", opposite)