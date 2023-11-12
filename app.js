const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectDatabase = require('./config/database.js')
const errorMiddleware = require('./middlewares/error.js')
const cookieParser = require('cookie-parser')

// Setup body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json()); // Parse JSON payloads
// app.use(express.urlencoded({ extended: true }));

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

//Set cookie parser
app.use(cookieParser())

// Middleware to handle errros
app.use(errorMiddleware)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server started on ${PORT} in ${process.env.NODE_ENV} mode.`)
})
