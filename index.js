require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('mongoose');

const authRouter = require('./routes/auth');
const courseRouter = require('./routes/course');


app.use(
    cors({
        origin: "*",
    })
);

app.get('/' , ( req , res ) => {
    res.json({ message: "Hello world!"})
} );



const PORT = process.env.PORT || 5000;

//databse connect

const start = async () => {
    try {
        await db.connect(process.env.MONGOD_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
        .then( () => console.log('Connected to Database'));
        app.listen( PORT , () => console.log(`Server is listening at ${PORT}`));
    } catch (error) {
        console.log(error.message);
    }
}

//Routes

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth' , authRouter );
app.use('/api/v1/course' , courseRouter );


start();