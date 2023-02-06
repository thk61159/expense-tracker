const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')


if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')//使用時省略寫副檔名
app.set('views', './views')//使用時省略./views
app.use(methodOverride('_method'));//RESTful API for PUT and DELET
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})
app.listen(PORT, () =>
	console.log(`server is listening to  http://localhost/${PORT}`)
)
