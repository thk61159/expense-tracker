module.exports = {
	authenticator: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next()
		}
		req.flash('warning_msg', '請先登入才能使用！') //flash module 提示錯誤
		res.redirect('/login')
	},

}
