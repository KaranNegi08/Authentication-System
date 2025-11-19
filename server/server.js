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

app.use(cors({
  origin: ["https://authentication-system08.netlify.app","https://authentication-system-1-eqe4.onrender.com"], 
   methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://authentication-system08.netlify.app",
//   "https://authentication-system-2emx.onrender.com"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, origin);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );


app.options("*", cors());


//API Endpoints



app.get('/' ,(req,res) =>{
  res.send({
    activeStatus: true,
    error:false,
    message: "Server is up and running"
  })
})

app.get("/check", (req, res) => {
  res.json({ msg: "Backend connected!" });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})

