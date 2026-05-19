import express from 'express';
import {createStudentProfile, getMyProfile , updateStudentProfile} from '../../controllers/studentsController/studentProfile.controller.js';

import { protectStudent } from '../../middleware/auth.middleware.js';

const studentProfileRouter = express.Router();

studentProfileRouter.post('/create', protectStudent, createStudentProfile);
studentProfileRouter.get('/me', protectStudent, getMyProfile);
studentProfileRouter.patch('/update', protectStudent, updateStudentProfile)


export default studentProfileRouter;