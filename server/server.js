import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app=express();
const port=process.env.PORT||4000;

connectDB();






app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5174", "https://authentication-system08.netlify.app"], 
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://authentication-system08.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());


//API Endpoints

app.get('/' ,(req,res) =>{
  res.send({
    activeStatus: true,
    error:false,
    message: "Server is up and running"
  })
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})

