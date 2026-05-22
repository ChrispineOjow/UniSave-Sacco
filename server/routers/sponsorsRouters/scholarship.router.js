import express from 'express';
import {
    getAllScholarships,
    getScholarshipById,
    getMatchedSholarships
} from "../../controllers/sponsorsController/scholarship.controller.js";
import {protectStudent} from "../../middleware/auth.middleware.js";

const scholarshipRouter = express.Router();

scholarshipRouter.get("/",getAllScholarships);
scholarshipRouter.get("/match", protectStudent, getMatchedSholarships);
scholarshipRouter.get("/:id", protectStudent, getScholarshipById)


export default scholarshipRouter;
