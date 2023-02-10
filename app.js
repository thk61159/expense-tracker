const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
// const passport = require('passport')
const flash = require('connect-flash')


require('./config/mongoose')
const routes = require('./routes')
const passport = require('./config/passport')
const hbsHelpers = require('./helpers/hbsHelpers')

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs', helpers: hbsHelpers }))
app.set('view engine', 'hbs')//使用時省略寫副檔名
app.set('views', './views')//使用時省略./views
app.use(methodOverride('_method'));//RESTful API for PUT and DELET
app.use(express.static('public'))
app.use(flash())

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
	res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
	res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
	res.locals.currentUser = req.user
	next()
})


app.use(routes)

app.listen(PORT, () =>
	console.log(`server is listening to  http://localhost/${PORT}`)
)
