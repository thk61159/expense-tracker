const router = require('express').Router()
const auth = require('./auth')
const userController = require('../controllers/user-controllers')
const expenseController = require('../controllers/expense-controller')
const { authenticator } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.put('/:id/edit', authenticator, expenseController.putEditExpence)
router.get('/:id/edit', authenticator, expenseController.getEditExpence)
router.delete('/:id', authenticator, expenseController.deleteExpence)
router.get('/new', authenticator, expenseController.getNewExpense)
router.post('/new', authenticator, expenseController.postNewExpense)
router.get('/sorting', authenticator, expenseController.sortingList)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)
router.post('/login', userController.login)
router.use('/auth', auth)
router.get('/logout', userController.logout)

router.get('/', authenticator, expenseController.spendingList)
router.use('/', generalErrorHandler)

module.exports = router