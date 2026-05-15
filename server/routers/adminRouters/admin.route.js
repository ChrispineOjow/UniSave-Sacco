import express from 'express';
import{
    loginAdmin,
    getPendingStudents,
    getAllStudents,
    approveStudent,
    rejectStudent,
    createAdmin
} from '../../controllers/adminController/admin.controller.js';
import {protectAdmin} from '../../middleware/auth.middleware.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);

adminRouter.get('/students/pending', protectAdmin, getPendingStudents);
adminRouter.get('/students/all', protectAdmin, getAllStudents);
adminRouter.patch('/students/:studentId/approve', protectAdmin, approveStudent);
adminRouter.patch('/students/:studentId/reject', protectAdmin, rejectStudent);
adminRouter.post('/create', protectAdmin, createAdmin);

export default adminRouter;