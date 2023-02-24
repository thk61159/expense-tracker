const passport = require('passport')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const userController = {
	loginPage: (req, res) => {
		res.render('auth/login')
	},
	registerPage: (req, res) => {
		res.render('auth/register')
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
	confirmMailPage: (req, res) => {
		res.render('auth/confirmMail')
	},
	passwordResetPage: (req, res) => {
		res.render('auth/passwordReset')
	},
	passwordReset: async (req, res, next) => {
		try {
			const { email } = req.body
			
			if (!email) throw new Error('請輸入信箱')
			const user = await User.findOne({ email })
			if (!user) throw new Error('此信箱未註冊')
			const payload = {
				id: user._id,
				email,
			}
			const resetInterval = Number(new Date()) - Number(user.updatedAt)
			const waitingTime = (24 * 60 * 60 * 1000 - resetInterval) / 3600000
			if (waitingTime > 0)
				throw new Error(
					`重設密碼間隔過短，請${Math.floor(waitingTime)}小時後再嘗試`
				)

			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: 60 * 30,
			})
			const homeAddress = process.env.HOME_ADDRESS

			let transporter = await nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 465,
				secure: true, // true for 465, false for other ports
				auth: {
					user: process.env.GOOGLE_SMTP_ADDRESS,
					pass: process.env.GOOGLE_SMTP_PASSWORD,
				},
			})
			console.log('正在發送email')
			// send mail with defined transport object
			let info = await transporter.sendMail({
				from: process.env.GOOGLE_SMTP_ADDRESS,
				to: email,
				subject: 'expense-tracker password reset ✔',
				html: `<a href=${homeAddress}/resetPassword/${token}>Please reset password in 30 mins.</a>`,
			})
			console.log(`${homeAddress}/resetPassword/${token}`)
			res.redirect('/confirmMail')
		} catch (err) {
			return next(err)
		}
	},
	resetPasswordPage: (req, res) => {
		const { token } = req.params
		res.render('auth/resetPassword', { token })
	},
	resetPassword: async (req, res, next) => {
		try {
			const { token } = req.params
			const { password, confirmPassword } = req.body
			try {
				//確認資料無誤
				userController.checkRegisterInput(
					'name',
					'email',
					password,
					confirmPassword
				)
			} catch (err) {
				return next(err)
			}
			const decoded = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET))
			const payload = JSON.parse(decoded)
			const user = await User.findById(payload.id)
			const resetInterval = Number(new Date()) - Number(user.updatedAt)
			const waitingTime = (24 * 60 * 60 * 1000 - resetInterval) / 3600000
			if (waitingTime > 0)
				throw new Error(
					`重設密碼間隔過短，請${Math.floor(waitingTime)}小時後再嘗試`
				)
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)
			user.password = hash
			user.updatedAt = new Date()
			await user.save()
			res.redirect('/login')
		} catch (err) {
			return next(err)
		}
	},
	checkRegisterInput: function (name, email, password, confirmPassword) {
		if (!(name && email && password && confirmPassword))
			throw new Error('所有空格為必填')
		if (password !== confirmPassword) throw new Error('密碼與確認密碼不符')
	},
}

module.exports = userController
