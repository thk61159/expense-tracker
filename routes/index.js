const router = require('express').Router()
const userController = require('../controllers/user-controllers')
const expenseController = require('../controllers/expense-controller')


router.get('/login', userController.loginPage)
router.get('/register', userController.registerPage)


router.get('/', expenseController.spendingList)

module.exports = router