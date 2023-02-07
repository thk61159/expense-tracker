const db = require('../../config/mongoose')
const User = require('../user')
const Expense = require('../expense')
const bcrypt = require('bcryptjs')
const SEED_USER = {
	name: 'root',
	email: 'root@example.com',
	password: '12345678',
}
const seedUser = async () => {
	await bcrypt
		.genSalt(10)
		.then(salt => bcrypt.hash(SEED_USER.password, salt))
		.then(hash =>
			User.create({
				name: SEED_USER.name,
				email: SEED_USER.email,
				password: hash,
			})
		)
		.then(() => {
			console.log('user created.')
			// process.exit()
		})
}
const seedExpense = async () => {
	await Expense
		.create({
			type: '支',
			name: '午餐',
			date: '2023/02/07',
			category: '食',
			cost: 300,
		})
		.then(() => {
			console.log('expense created.')
			// process.exit()
		})
}
db.once('open', async () => {
	try {
		console.log('mongodb connected!')
		await seedUser()
		await seedExpense()
		process.exit()
	} catch (err) {
		console.log(err)
	}
})
