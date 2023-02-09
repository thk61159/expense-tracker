const router = require('express').Router()
const passport = require('passport')
router.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: ['email', 'public_profile'], //想與fb要的資料
	})
)
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/')
	}
)

router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/')
	}
)

module.exports = router