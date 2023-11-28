const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors") 
const rateLimit = require("express-rate-limit")
const dotenv = require("dotenv");
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

// Rate limit to every api
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

const app = express()
const port = 5000

//importing routes
const authRoutes = require('./src/routes/authRoutes.js') 
const userRoutes = require('./src/routes/userRoutes.js')

app.use(express.json())  
app.use(limiter);                   

// CORS options
const corsOptions = {
    origin: ['http://api.example.com'],
};
  
// CORS middleware
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.options('/api/public', cors({ origin: '*' }));
app.options('/api/users/:id', cors({ origin: '*' }));

//connecting db
mongoose.connect(process.env.MONGO_CONNECTION)
    .then(() => {
        console.log('mongoose Connected successfully')
    })
    .catch((err) => {
        console.log(err)
    })


// Define Your Routes Here
app.use('/api/auth/', authRoutes)
app.use('/api/users/', userRoutes)

app.get('/', (req, res) => {
    res.send('Hello World, from express.');
});

const server = app.listen(port, () => {
    console.log(`Server started at ${port}`)
})

module.exports = {app,server};