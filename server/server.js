import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
await connectDB();
//Middleware
app.use(express.json());
//Routes
app.get('/', (req, res)=>{
    res.json({ message: 'Welcome to UniSave Sacco System API' });
})

app.listen(PORT, ()=>{
    console.log(`Server is running on localhost:${PORT}`);
})

