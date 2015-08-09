module.exports = {
  log: console.log.bind(console),
  async: function (fn) { setTimeout(fn, 0); },
  concat: function (a, b) { return a.concat(b) }
}