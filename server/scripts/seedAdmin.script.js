import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import Admin from '../models/adminModels/admin.model.js';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, '../.env')});

const seedAdmin = async () => {
    try{

        await mongoose.connect(process.env.MONGODB_URI);
        const existing = await Admin.findOne({email: 'admin@unisave.co.ke'});
        if(existing){
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        await Admin.create({
            email: 'admin@unisave.co.ke',
            password:hashedPassword,
            role: 'superadmin'
        });

        console.log("Admin created successfully");
        process.exit(0);

    }catch(error){

        console.error('Error seeding admin:', error.message);
        process.exit(1);

    }
}

seedAdmin();