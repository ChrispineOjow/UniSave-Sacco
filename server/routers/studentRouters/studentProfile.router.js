import express from 'express';
import {createStudentProfile} from '../../controllers/studentsController/studentProfile.controller.js';
import { protectStudent } from '../../middleware/auth.middleware.js';

const studentProfileRouter = express.Router();

studentProfileRouter.post('/create', protectStudent, createStudentProfile);

export default studentProfileRouter;