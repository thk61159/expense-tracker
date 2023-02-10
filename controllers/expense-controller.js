const Expense = require('../models/expense')
const Category = require('../models/category')
const expenseController = {
	spendingList: async (req, res, next) => {
		try {
			const userId = req.user._id
			const data = await Expense.find({ userId }).lean()
			const categories = await Category.find().lean()
			const expenses = data.map(expense => ({
				...expense,
				category: categories.find(
					element => String(element._id) === String(expense.categoryId)
				),
			}))
			console.log(data)
			let totalSpending = 0
			for (const element of expenses) {
				if (element.type === '收') {
					totalSpending += element.cost
				} else {
					totalSpending -= element.cost
				}
			}
			
			res.render('index', { expenses, totalSpending, categories })
		} catch (err) {
			return next(err)
		}
	},
	sortingList: (req, res, next) => {
		res.send('it is going to sort data')
	},
	getNewExpense: async (req, res, next) => {
		try {
			const categories = await Category.find().lean()
			res.render('new', { categories })
		} catch (err) {
			return next(err)
		}
	},
	getEditExpence: async (req, res, next) => {
		try {
			
			const expenseId = req.params.id
			const expense = await Expense.findById(expenseId).lean()
			const categories = await Category.find().lean()
			res.render('edit', {
				expense,
				categories,
				categoryId: expense.categoryId,
			})
		} catch (err) {
			return next(err)
		}
	},
	postNewExpense: async (req, res, next) => {
		try {
			const userId = req.user._id
			const { type, name, date, categoryId, cost } = req.body
			try {
				expenseController.checkNewOrEditInput(
					type,
					name,
					date,
					categoryId,
					cost,
				)
				
			} catch (err) {
				return next(err)
			}
			await Expense.create({
				type,
				name,
				date,
				categoryId,
				cost,
				userId,
			})
			req.flash('success_messages', 'expense was successfully created')
			res.redirect('/')
		} catch (err) {
			return next(err)
		}
	},
	putEditExpence: async (req, res, next) => {
		try {
			const expenseId = req.params.id
			const { type, name, date, categoryId, cost } = req.body
			try {
				expenseController.checkNewOrEditInput(
					type,
					name,
					date,
					categoryId,
					cost
				)
			} catch (err) {
				return next(err)
			}
			const expense = await Expense.findById(expenseId)
			for (const key in req.body) {
				expense[key] = req.body[key]
			}
			await expense.save()
			res.redirect(`/`)
		} catch (err) {
			return next(err)
		}
	},
	deleteExpence: async (req, res, next) => {
		try {
			const expenseId = req.params.id
			if (!expenseId) throw new Error('不存在的物件或使用者')
			const expense = await Expense.findById(expenseId)
			await expense.remove()
			res.redirect(`/`)
		} catch (err) {
			return next(err)
		}
	},

	checkNewOrEditInput: function (type, name, date, categoryId, cost) {
		if (type.length !== 1 && (type !== '收' || type !== '支'))
			throw new Error('不存在的收支方法')
		if (!name) throw new Error('名稱為必填')
		if (!date) throw new Error('日期為必填')
		if (!String(categoryId)) throw new Error('請選擇收支總類')
		if (!cost || Number(cost) < 0) throw new Error('請輸入大於0的『數字』')
	},
}

module.exports = expenseController
