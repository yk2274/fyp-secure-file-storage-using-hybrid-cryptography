if (process.env.NODE_ENV !== 'production') {
    require ('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const postRoutes = require('./routes/posts.js')
const userRoutes = require('./routes/users.js')
const whitelistRoutes = require('./routes/whitelist.js')

const app = express()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes)
app.use('/user', userRoutes)
app.use('/whitelist', whitelistRoutes)


const CONNECTION_URL = process.env.DATABASE_URL
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`))

mongoose.set('useFindAndModify', false)