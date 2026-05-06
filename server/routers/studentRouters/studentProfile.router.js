import express from 'express';
import {createStudentProfile} from '../../controllers/studentsController/studentProfile.controller.js';

const studentProfileRouter = express.Router();

studentProfileRouter.post('/create', createStudentProfile);

export default studentProfileRouter;