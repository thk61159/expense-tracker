const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expenseSchema = new Schema({
	type: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	cost: {
		type: Number,
		required: true,
	},
	// userId: {
	// 	type: Schema.Types.ObjectID,
	// 	ref: 'User',
	// 	index: true,
	// 	required: true,
	// },
})
module.exports = mongoose.model('Expense', expenseSchema)
