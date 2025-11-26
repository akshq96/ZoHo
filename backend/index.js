// const express = require('express');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./src/config/dbConnect');

// dotenv.config();

// const PORT = process.env.PORT;
// const app = express();

// // Database connection
// connectDB();

// app.listen(PORT,() => {
//     console.log(`Server is running on port ${PORT}`)
// })
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv').config(); 
const connectDB = require('./src/config/dbConnect');
const bodyParser = require('body-parser');
const authRoute = require('./src/routes/authRoute');

// dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



