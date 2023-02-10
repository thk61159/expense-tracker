const Expense = require('../models/expense')
const expenseController = {
	spendingList: (req, res, next) => {
		Expense.find()
			.lean()
			.then(expenses => {
				let totalSpending=0
				for (const element of expenses) {
					if (element.type === '收') {
						totalSpending += element.cost
					} else {
						totalSpending -= element.cost
					}
				}
				res.render('index', { expenses, totalSpending })
			})
			.catch(err => next(err))
	},
	sortingList:(req, res, next) => {
		res.send('it is going to sort data')
	},
	getNewExpense: (req, res) => {
		res.render('new')
	},
	getEditExpence: (req, res, next) => {
		const expenseId = req.params.id
		Expense.findById(expenseId)
			.lean()
			.then(expense => res.render('edit', { expense }))
			.catch(err => next(err))
	},
	postNewExpense: (req, res, next) => {
		const { type, name, date, category, cost } = req.body
		try {
			expenseController.checkNewOrEditInput(type, name, date, category, cost)
		} catch (err) {
			return next(err)
		}
		return Expense.create({
			type,
			name,
			date,
			category,
			cost,
		})
			.then(() => {
				req.flash('success_messages', 'expense was successfully created')
				res.redirect('/')
			})
			.catch(err => next(err))
	},
	putEditExpence: (req, res, next) => {
		const expenseId = req.params.id
		const { type, name, date, category, cost } = req.body
		try {
			expenseController.checkNewOrEditInput(type, name, date, category, cost)
		} catch (err) {
			return next(err)
		}
		Expense.findById(expenseId)
			.then( expense => {
				 for (const key in req.body) {
				 expense[key] = req.body[key]
				}
				return expense.save()
			})
			.then(() => res.redirect(`/`))
			.catch(err => next(err))
	},
	deleteExpence: (req, res, next) => { 
		const expenseId = req.params.id
		console.log(req.params)
		if(!expenseId) throw new Error('不存在的物件或使用者')
		Expense.findById(expenseId)
			.then(expense => expense.remove())
			.then(() => res.redirect(`/`))
    	.catch((err) => next(err));

	},

	checkNewOrEditInput: function (type, name, date, category, cost) {
		if (type.length !== 1 && (type !== '收' || type !== '支'))
			throw new Error('不存在的收支方法')
		if (!name) throw new Error('名稱為必填')
		if (!date) throw new Error('日期為必填')
		if (!category) throw new Error('請選擇收支總類')
		if (!cost || Number(cost) < 0) throw new Error('請輸入大於0的『數字』')
	},
}

module.exports = expenseController
