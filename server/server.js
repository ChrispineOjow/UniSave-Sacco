import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import './config/email.config.js'
import connectDB from './config/db.config.js';
import studentAuthRouter from './routers/studentRouters/studentAuth.router.js';
import studentProfileRouter from './routers/studentRouters/studentProfile.router.js';
import adminRouter from './routers/adminRouters/admin.route.js';
import scholarshipRouter from './routers/sponsorsRouters/scholarship.router.js';
import applicationRouter from './routers/applicationRouters/application.router.js';
import { startCronJobs } from './services/cron.service.js';

const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
const allowedOrigins = [
  'http://localhost:5173', 
  /\.vercel\.app$/        
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

//Routes
app.get('/', (req, res)=>{
    res.json({ message: 'Welcome to UniSave Sacco System API' });
})
app.use('/api/students/auth', studentAuthRouter);
app.use('/api/students/profile', studentProfileRouter);
app.use('/api/admin', adminRouter);
app.use('/api/students/scholarships', scholarshipRouter);
app.use('/api/students/applications',applicationRouter)

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    startCronJobs();

    const cleanup = async (signal) => {
        console.log(`\n${signal} received, closing server and DB connection...`);
     
        const server = app.listen(PORT, ()=>{
            console.log(`Server is running on localhost:${PORT}`);
        });

        server.close(()=>{
            console.log('HTTP server closed');
        });

        await mongoose.connection.close();
        console.log('DB connection closed');

        process.exit(0);
    }

    process.once('SIGINIT',() => cleanup('SIGINIT') );
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
});