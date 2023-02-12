const jwt = require('jsonwebtoken')
module.exports = {
	resetLimit: (req, res, next) => {
		try {
			const { token } = req.params
			jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
				if (err) {
					req.flash('warning_messages', '重設密碼網址失效！請重新發送重設密碼信件') 
					res.redirect('/forgotPassword')
				}
        return next()
			})
		} catch (err) {
			return next(err)
		}
	},
}
