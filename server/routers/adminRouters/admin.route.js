import express from 'express';
import{
    loginAdmin,
    getPendingStudents,
    getAllStudents,
    approveStudent,
    rejectStudent,
    createAdmin,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    verifyScholarship,
    getAllScholarshipsAdmin,
    updateApplicationStatus,
    getAllApplications
} from '../../controllers/adminController/admin.controller.js';
import {protectAdmin} from '../../middleware/auth.middleware.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);

adminRouter.get('/students/pending', protectAdmin, getPendingStudents);
adminRouter.get('/students/all', protectAdmin, getAllStudents);
adminRouter.patch('/students/:studentId/approve', protectAdmin, approveStudent);
adminRouter.patch('/students/:studentId/reject', protectAdmin, rejectStudent);
adminRouter.post('/create', protectAdmin, createAdmin);


//Scholarship routes
adminRouter.post("/scholarships/add", protectAdmin, addScholarship);
adminRouter.get("/scholarships/all", protectAdmin, getAllScholarshipsAdmin);
adminRouter.patch("/scholarships/update/:id", protectAdmin, updateScholarship);
adminRouter.delete("/scholarships/delete/:id", protectAdmin, deleteScholarship);
adminRouter.patch("/scholarships/verify/:id", protectAdmin, verifyScholarship);

//Application routes
adminRouter.patch("/applications/update/:id", protectAdmin, updateApplicationStatus);
adminRouter.get('/applications/all', protectAdmin,getAllApplications);

export default adminRouter;