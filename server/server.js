import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import studentAuthRouter from './routers/studentRouters/studentAuth.router.js';

const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
//Routes
app.get('/', (req, res)=>{
    res.json({ message: 'Welcome to UniSave Sacco System API' });
})
app.use('/api/students/auth', studentAuthRouter);


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on localhost:${PORT}`);
    });

}).catch((error)=>{
    console.log('DB connection failed:  ', error.message);
})



