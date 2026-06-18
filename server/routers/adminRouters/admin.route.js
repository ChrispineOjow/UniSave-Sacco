import express from 'express';
import{
    loginAdmin,
    logoutAdmin,
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
    getAllApplications,
    getStudentProfileById,
    deleteStudent,
    getActiveScholarships,
    toggleArchivedScholarship,
    getArchivedScholarships
} from '../../controllers/adminController/admin.controller.js';
import {protectAdmin} from '../../middleware/auth.middleware.js';

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/logout', protectAdmin, logoutAdmin);

adminRouter.get('/students/pending', protectAdmin, getPendingStudents);
adminRouter.get('/students/all', protectAdmin, getAllStudents);
adminRouter.patch('/students/:studentId/approve', protectAdmin, approveStudent);
adminRouter.patch('/students/:studentId/reject', protectAdmin, rejectStudent);
adminRouter.post('/create', protectAdmin, createAdmin);
adminRouter.get('/students/:studentAuthId/profile', protectAdmin, getStudentProfileById);
adminRouter.delete('/students/:studentId', protectAdmin, deleteStudent);


//Scholarship routes
adminRouter.post("/scholarships/add", protectAdmin, addScholarship);
adminRouter.get("/scholarships/all", protectAdmin, getAllScholarshipsAdmin);
adminRouter.patch("/scholarships/update/:id", protectAdmin, updateScholarship);
adminRouter.delete("/scholarships/delete/:id", protectAdmin, deleteScholarship);
adminRouter.patch("/scholarships/verify/:id", protectAdmin, verifyScholarship);
adminRouter.get("/scholarships/active", protectAdmin, getActiveScholarships);
adminRouter.patch("/scholarships/archive/:id", protectAdmin, toggleArchivedScholarship);
adminRouter.get("/scholarships/archived/all", protectAdmin, getArchivedScholarships);

//Application routes
adminRouter.patch("/applications/update/:id", protectAdmin, updateApplicationStatus);
adminRouter.get('/applications/all', protectAdmin,getAllApplications);

export default adminRouter;