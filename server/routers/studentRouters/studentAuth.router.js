import express from 'express';
import {
    registerStudent, 
    loginStudent,
    logoutStudent} from '../../controllers/studentsController/studentAuth.controller.js';
import { protectStudent } from '../../middleware/auth.middleware.js';

const studentRouter = express.Router();

studentRouter.post('/register', registerStudent);
studentRouter.post('/login', loginStudent);

studentRouter.post('/logout', protectStudent, logoutStudent);


export default studentRouter;