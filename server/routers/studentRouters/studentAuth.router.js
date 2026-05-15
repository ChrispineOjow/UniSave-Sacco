import express from 'express';
import {
    registerStudent, 
    loginStudent,
    logoutStudent,
    getAllStudents} from '../../controllers/studentsController/studentAuth.controller.js';
import { protectStudent } from '../../middleware/auth.middleware.js';

const studentRouter = express.Router();

studentRouter.post('/register', registerStudent);
studentRouter.get('/login', getAllStudents);

studentRouter.post('/logout', protectStudent, logoutStudent);
studentRouter.get('/all', protectStudent, getAllStudents)

export default studentRouter;