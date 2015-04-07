module.exports = {
  log: console.log.bind(console),
  parseBoolean: function (str) { return str.match(/(t|true)/i) },
  concat: function (a, b) { return a.concat(b) }
}