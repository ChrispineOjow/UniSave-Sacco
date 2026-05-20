import express from 'express';
import {
    saveScholarship,
    applyForScholarship,
    getMyApplication,
    updateApplicationStatus,
    deleteApplication
}from '../../controllers/applicationControllers/application.controller.js';

import {protectStudent} from '../../middleware/auth.middleware.js';

const applicationRouter = express.Router();

applicationRouter.post('/save', protectStudent, saveScholarship);
applicationRouter.post('/apply',protectStudent,applyForScholarship);
applicationRouter.get('/me', protectStudent,getMyApplication);
applicationRouter.patch('/update/:id', protectStudent, updateApplicationStatus);
applicationRouter.delete('/delete/:id', protectStudent,deleteApplication);


export default applicationRouter;
