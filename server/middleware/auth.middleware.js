import jwt from 'jsonwebtoken';
import StudentAuth from '../models/studentModels/studentAuth.model.js';


export const protectStudent = async (req, res, next) => {
    try{

        const token = req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(401).json(
                {
                    message: 'No token, access denied'
                }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const student = await StudentAuth.findById(decoded.id).select('-password');
        if(!student){
            return res.status(401).json(
                {
                    message: 'Invalid token, access denied'
                }
            )
        }

        req.student = student;
        next();

    }catch(error){

        res.status(401).json({
            message: 'Token expired or invalid'
        })

    }
}