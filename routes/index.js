const router = require('express').Router()
const auth = require('./auth')
const userController = require('../controllers/user-controllers')
const expenseController = require('../controllers/expense-controller')
const { authenticator } = require('../middleware/auth')

router.get('/register', userController.registerPage)
router.post('/register', userController.register)

router.get('/login', userController.loginPage)
router.post('/login', userController.login)
router.use('/auth', auth)

router.get('/logout', userController.logout)


router.get('/', authenticator , expenseController.spendingList)

module.exports = router