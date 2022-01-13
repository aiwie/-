function getUrlParam(name) {
  undefined
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

function timeFn() {
  let time = new Date()
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  m = m > 9 ? m : '0' + m
  let d = time.getDate()
  d = d > 9 ? d : '0' + d
  let h = time.getHours()
  h = h > 9 ? h : '0' + h
  let f = time.getMinutes()
  f = f > 9 ? f : '0' + f
  let s = time.getSeconds()
  s = s > 9 ? s : '0' + s
  return `${y}-${m}-${d}`
}
