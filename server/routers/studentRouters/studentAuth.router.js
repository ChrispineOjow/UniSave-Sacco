import express from 'express';
import {registerStudent, getAllStudents} from '../../controllers/studentsController/studentAuth.controller.js';


const studentRouter = express.Router();

studentRouter.post('/register', registerStudent);
studentRouter.get('/all', getAllStudents);

export default studentRouter;