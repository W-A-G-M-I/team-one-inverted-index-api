import express from 'express';
import path from 'path'
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/rides.routes.js';
// import postRoutes from './routes/post.routes.js';
// import messageRoutes from './routes/message.routes.js';
// import notificationRoutes from './routes/notification.routes.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import { connectDB } from './lib/db/connectMongoDb.js';

dotenv.config()
const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// this is used to parse incoming JSON data in the request body.
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: true }));
// this is used to parse cookies from the request headers in the req.cookies.
app.use(cookieParser())

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };
  
// Apply CORS middleware
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/ride', productRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/notification', notificationRoutes);
// app.use('/api/message', messageRoutes)


// console.log(process.env.MONGO_URL);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})