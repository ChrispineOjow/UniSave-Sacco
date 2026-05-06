import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/db.js';
import studentAuthRouter from './routers/studentRouters/studentAuth.router.js';
import studentProfileRouter from './routers/studentRouters/studentProfile.router.js';

const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
//Routes
app.get('/', (req, res)=>{
    res.json({ message: 'Welcome to UniSave Sacco System API' });
})
app.use('/api/students/auth', studentAuthRouter);
app.use('/api/students/profile', studentProfileRouter);


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on localhost:${PORT}`);
    });

    const cleanup = async (signal) => {
        console.log(`\n${signal} received, closing server and DB connection...`);
     
        server.close(()=>{
            console.log('HTTP server closed');
        });

        await mongoose.connection.close();
        console.log('DB connection closed');

        process.exit(0);
    }

    process.once('SIGNIT',() => cleanup('SIGNIT') );
    process.once('SIGTERM',() => cleanup('SIGTERM'));
    process.once('SIGQUIT', () => cleanup('SIGQUIT'));

    process.once('uncaughtException', (error)=>{

        console.error('Uncaught Exception: ', error.message);
        cleanup('uncaughtException');

    })

    process.once('unhandledRejection', (reason)=>{
        console.error('Unhandled Rejection: ', reason);
        cleanup('unhandledRejection');
    });



}).catch((error)=>{
    console.log('DB connection failed:  ', error.message);
    process.exit(1);
})



