const mongoose = require('mongoose')

const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true
  }).then(con => {
    console.log(`MongoDB database connected with host ${con.connection.host}`)
  })
}

module.exports = connectDatabase
