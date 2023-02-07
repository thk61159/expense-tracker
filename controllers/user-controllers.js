
const userController = {
	loginPage: (req, res) => {
		res.render('login')
	},
	registerPage: (req, res) => {
		res.render('register')
  },
  login: (req, res) => { 
    res.redirect('/')
  },
	register: (req, res) => {
		const { name, email, password, confirmPassword } = req.body
    res.redirect('/login')
  },
  logout: (req, res) => {
    res.send('it will logout user')
   }
}

module.exports = userController