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
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const user = await User.findOne({ email })
				if (!user) {
					return done(
						null,
						false,
						req.flash('warning_messages', '錯誤信箱或密碼！')
					)
				}
				const isMatch = await bcrypt.compare(password, user.password)
				if (!isMatch) {
					return done(
						null,
						false,
						req.flash('warning_messages', '錯誤信箱或密碼！')
					)
				}
				return done(null, user)
			} catch (err) {
				return done(err, false)
			}
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
		async (accessToken, refreshToken, profile, done) => {
			try {
				const { name, email } = profile._json
				let user = await User.findOne({ email })
				if (user) {
					return done(null, user)
				}
				const randomPassword = Math.random().toString(36).slice(-8)
				const salt = await bcrypt.genSalt(10)
				const hash = await bcrypt.hash(randomPassword, salt)
				user = await User.create({
					name,
					email,
					password: hash,
				})
				return done(null, user)
			} catch (err) {
				return done(err, false)
			}
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
		async (accessToken, refreshToken, profile, done) => {
			try {
				const { name, email } = profile._json
				let user = await User.findOne({ email })
				if (user) {
					return done(null, user)
				}
				const randomPassword = Math.random().toString(36).slice(-8)
				const salt = await bcrypt.genSalt(10)
				const hash = await bcrypt.hash(randomPassword, salt)
				user = await User.create({
					name,
					email,
					password: hash,
				})
				return	done(null, user)
					
			}catch (err) {
				return done(err, false)
			}
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
