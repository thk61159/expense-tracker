const passport = require('passport')
const userController = {
	loginPage: (req, res) => {
		res.render('login')
	},
	registerPage: (req, res) => {
		res.render('register')
	},
	login: (req, res, next) => {
		passport.authenticate('local', (err, user) => {
			if (err) return next(err)
			if (!user) return res.redirect('/login')
			req.logIn(user, err => {
				if (err) return next(err)

				return res.redirect('/')
			})
		})(req, res, next)
	},
	register: (req, res) => {
		const { name, email, password, confirmPassword } = req.body
		res.redirect('/login')
	},
	logout: (req, res) => {
		req.logout(req.user, err => {
			if (err) return next(err)
			req.flash('success_msg', '你已經成功登出。')
			res.redirect('/login')
		})
	},
}

module.exports = userController
