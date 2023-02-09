const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		function (email, password, done) {
			User.findOne({ email }).then(user => {
				if (!user) {
					return done(null, false, req.flash('warning_msg', '錯誤信箱或密碼！'))
				}

				return bcrypt
					.compare(password, user.password)
					.then(isMatch => {
						if (!isMatch) {
							return done(
								null,
								false,
								req.flash('warning_msg', '錯誤信箱或密碼！')
							)
						}
						return done(null, user)
					})
					.catch(err => done(err, false))
			})
		}
	)
)
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK,
			profileFields: ['email', 'displayName'],
		},
		function (accessToken, refreshToken, profile, done) {
			const { name, email } = profile._json
			User.findOne({ email }).then(user => {
				if (user) {
					return done(null, user)
				}
				const randomPassword = Math.random().toString(36).slice(-8)
				bcrypt
					.genSalt(10)
					.then(salt => bcrypt.hash(randomPassword, salt))
					.then(hash =>
						User.create({
							name,
							email,
							password: hash,
						})
					)
					.then(user => done(null, user))
					.catch(e => done(e, false))
			})
		}
	)
)
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK,
			scope: ['profile'],
		},
		function (accessToken, refreshToken, profile, done) {
			const { name, email } = profile._json
			User.findOne({ email }).then(user => {
				if (user) {
					return done(null, user)
				}
				const randomPassword = Math.random().toString(36).slice(-8)
				bcrypt
					.genSalt(10)
					.then(salt => bcrypt.hash(randomPassword, salt))
					.then(hash =>
						User.create({
							name,
							email,
							password: hash,
						})
					)
					.then(user => done(null, user))
					.catch(e => done(e, false))
			})
		}
	)
)
passport.serializeUser((user, done) => {
	done(null, user.id)
})
passport.deserializeUser((id, done) => {
	User.findById(id)
		.lean()
		.then(user => done(null, user))
		.catch(err => done(err, null))
})
module.exports = passport
