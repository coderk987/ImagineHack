// imports
const express = require('express')
const ejs = require('ejs')

// main variables
const app = express()
const port = process.env.PORT || 3000

// set the view engine to ejs and other parameters
app.set('view engine', 'ejs')
app.use(express.static('public'))

// home page
app.get('/', (req, res) => {
    res.render('index')
})

// patient dashboard
app.get('/patient-dashboard', (req, res) => {
    res.render('patientdashboard')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})