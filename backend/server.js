import e from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectToDb from "./MongoDB/connectToDB.js";
import authRoutes from './routes/auth.routes.js';
import ProductRoutes from './routes/product.routes.js';

dotenv.config();

const app = e();
const corsOption = {
    origin:'',
    credentials:true
};

app.use(cookieParser());
app.use(e.json());
app.use(cors(corsOption));

//user routes

app.use('/api', authRoutes);

app.use('/api',ProductRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    connectToDb();
    console.log("backend is now up",PORT);
})