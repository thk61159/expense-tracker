const passport = require('passport')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
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
	register: async (req, res, next) => {
		try {
			const { name, email, password, confirmPassword } = req.body
			try {
				//確認資料無誤
				userController.checkRegisterInput(
					name,
					email,
					password,
					confirmPassword
				)
			} catch (err) {
				res.render('register', { name, email })
				return next(err)
			}
			const user = await User.find({ email })
			if (user.length > 0) throw new Error('此信箱已被註冊')
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)
			await User.create({
				name,
				email,
				password: hash,
			})
			res.redirect('/login')
		} catch (err) {
			return next(err)
		}
	},
	logout: (req, res) => {
		req.logout(req.user, err => {
			if (err) return next(err)
			req.flash('success_messages', '你已經成功登出。')
			res.redirect('/login')
		})
	},
	checkRegisterInput: function (name, email, password, confirmPassword) {
		if (!(name && email && password && confirmPassword))
			throw new Error('所有空格為必填')
		if (password !== confirmPassword) throw new Error('密碼與確認密碼不符')
	},
}

module.exports = userController
