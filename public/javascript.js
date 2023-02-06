//////////for new and edit page//////////
const costCheck = document.querySelector('#costCheck')
const incomeCheck = document.querySelector('#incomeCheck')
const checktype = document.querySelector('.checktype')

checktype.addEventListener('click', event => {
  
  if (event.target.id === costCheck.id) {
    console.log('if')
		costCheck.checked = !costCheck.checked
		incomeCheck.checked = !costCheck.checked
  } else {
    console.log('else')
    incomeCheck.checked = !incomeCheck.checked
    costCheck.checked = !incomeCheck.checked
	}
})
console.log('test')
