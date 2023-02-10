const db = require('../../config/mongoose')
const User = require('../user')
const Expense = require('../expense')
const Category = require('../category')
const bcrypt = require('bcryptjs')
const SEED_USER = {
	name: 'root',
	email: 'root@example.com',
	password: '12345678',
}
const ExpenseData = [
	{
		type: '支',
		name: '午餐',
		date: '2023-02-01',
		cost: 90,
	},
	{
		type: '支',
		name: '衣服',
		date: '2023-02-02',
		cost: 3000,
	},
	{
		type: '收',
		name: '薪水',
		date: '2023-02-10',
		cost: 50000,
	},
	{
		type: '支',
		name: '保險',
		date: '2023-02-08',
		cost: 8000,
	},
	{
		type: '支',
		name: '台北高鐵',
		date: '2023-02-07',
		cost: 500,
	},
	{
		type: '支',
		name: 'switch',
		date: '2023-02-06',
		cost: 12000,
	},
]

const seedUser = async data => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(data.password, salt)
    return await User.create({
      name: data.name,
      email: data.email,
      password: hash,
    })
  } catch (err) {
    console.log(err)
  }
}
console.log(Math.floor(Math.random() * 6))
const seedExpense = async (data, categories, user) => {
	try {
    for (const expense of data) {
      
			await Expense.create({
				type: expense.type,
				name: expense.name,
				date: expense.date,
				categoryId: categories[Math.floor(Math.random() * 5 )]._id,
				cost: expense.cost,
				userId: user._id,
			})
		}
		console.log('expense created.')
	} catch (err) {
		console.log(err)
	}
}
db.once('open', async () => {
	try {
		console.log('mongodb connected!')
    const user = await seedUser(SEED_USER)
    const categories = await Category.find().lean()
		await seedExpense(ExpenseData,categories,user)

		process.exit()
	} catch (err) {
		console.log(err)
	}
})
