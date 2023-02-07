const mongoose = require('mongoose') // 載入 mongoose
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
}) // 設定連線到 mongoDB connect to 環境變數

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
	console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
	console.log('mongodb connected!')
})
module.exports = db
