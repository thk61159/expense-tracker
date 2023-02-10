module.exports = {
	ifCond: function (a, b, options) {
		a = String(a)
		b = String(b)
		return a === b ? options.fn(this) : options.inverse(this)
	},
	length: function (a) {
		return a.length
	},
}
