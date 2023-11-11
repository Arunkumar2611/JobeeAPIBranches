const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectDatabase = require('./config/database.js')
const errorMiddleware = require('./middlewares/error.js')

const cookieParser = require('cookie-parser')

//Importing all routes
const jobs = require('./routes/jobs.js')
const auth = require('./routes/auth.js')
const user = require('./routes/user.js')

app.use('/api/v1', jobs)
app.use('/api/v1', auth)
app.use('/api/v1', user)

// Setting up config.env file variables

dotenv.config({ path: './config/config.env' })

// connecting to database
connectDatabase()

// Setup body-parser

app.use(express.json())
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//Set cookie parser
app.use(cookieParser())


// creating own middleware

const middleware = (req, res, next) => {
  console.log('I am a middleware')

  // setting up the gloabal variable
  req.user = 'Alok'
  next()
}

app.use(middleware)

// Middleware to handle errros
app.use(errorMiddleware)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} in ${process.env.NODE_ENV} mode.`)
})
