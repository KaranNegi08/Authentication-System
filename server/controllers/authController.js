import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
 
export const register=async (req,res)=>{
    const {name,email,password}=req.body;   

    if(!name || !email || !password){
        return res.status(400).json({message:'All fields are required'});
    }

    try{
        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save user to database
        const user= new userModel({
            name,
            email,
            password:hashedPassword
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log("JWT_SECRET in verify:", process.env.JWT_SECRET);
console.log("Token:", token);


        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to KN Service',
            text: `Hello ${name},\n\nThank you for registering! We're excited to have you on board.\n\nBest,\nThe Team`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending welcome email:', error);
            } else {
                console.log('Welcome email sent:', info.response);
            }
        });

      return  res.status(201).json({message:'User registered successfully', token});
    }catch(error){
       return res.status(500).json({message:'Server Error'});
    }
}

export const login=async (req,res)=>{
    const {email,password}=req.body;   

    if(!email || !password){
        return res.status(400).json({success: false,message:'All fields are required'});
    }

    try{
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

       return res.status(200).json({success: true, message: 'User logged in successfully', token });
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};


//send verification otp to the user's email
export const sendVerifyOpt= async(req,res)=>{
//    const {email}=req.body;
//    if(!email){
//        return res.status(400).json({message:'Email is required'});
//    }
   try{
   const userId = req.user.id;  // ✅ coming from middleware
        const user = await userModel.findById(userId);

     if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    if(user.isAccountVerified){
        return res.status(400).json({message:'Account already verified'});
    }
   const otp = String(Math.floor(100000 + Math.random()*900000));
   user.verifyOtp=otp;
   user.verifyOtpExpireAt=Date.now()+24*60*1000; //otp valid for 24 hours
   await user.save();

   const mailOptions = {
       from: process.env.SENDER_EMAIL,
       to: user.email,
       subject: 'Account Verification OTP',
       text: `Your verification code is ${otp}. It is valid for 24 hours.`
   };

   await transporter.sendMail(mailOptions);  

   return res.status(200).json( { success:true, message:'Verification email sent'});
}catch(error){
       return res.status(500).json({message:'Server Error'});
   }
}


export const verifyEmail= async (req,res)=>{
   const {otp}=req.body;
   const userId = req.user.id;
   if(!otp){
       return res.status(400).json({message:'OTP is required'});
   }
   try{
       const user= await userModel.findById(userId);
       if(!user){
           return res.status(400).json({message:'User not found'});
       }
       if(user.verifyOtp !== otp || user.verifyOtp === ''){
           return res.status(400).json({message:'Invalid OTP'});
       }
       if(user.verifyOtpExpireAt < Date.now()){
           return res.status(400).json({message:'OTP expired'});
       }
       user.isAccountVerified = true;
       user.verifyOtp = '';
       user.verifyOtpExpireAt = 0;
       await user.save();
       return res.status(200).json({success:true, message:'Account verified successfully'});
   }catch(error){
       return res.status(500).json({success:false, message:'Server Error'});
   }
}

export const isAuthenticated= async (req,res)=>{
    try{
        return res.status(200).json({success:true});
    }
    catch(error){
res.status(500).json({message:error.message});
    }
}

export const sendResetOtp= async (req,res)=>{
    const {email}=req.body; 
    if(!email){
        return res.status(400).json({message:'Email is required'});
    }
    try{
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        const otp = String(Math.floor(100000 + Math.random()*900000));
   user.resetOtp=otp;
   user.resetOtpExpireAt=Date.now()+15*60*1000; //otp valid for 24 hours
   await user.save();

   const mailOptions = {
       from: process.env.SENDER_EMAIL,
       to: user.email,
       subject: 'Password Reset OTP',
       text: `Your OTP for resetting  your password is ${otp}. Use this OTP to proceed with resetting your password`
   };

   await transporter.sendMail(mailOptions); 
   return res.status(200).json({message:'Password reset OTP sent to your email'});
   }catch(error){
       return res.status(500).json({message:'Server Error'});
   }
}

//RESET USER PASSWORD
export const  resetPassword= async (req,res)=>{
    const {email,otp,newPassword}=req.body;
    if(!email || !otp || !newPassword){
        return res.status(400).json({success: false,message:'All fields are required'});
    }
    try{
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success: false,message:'User not found'});
        }
        // db.users.findOne({ email: "karanegi.agra@gmail.com" });

        console.log("DB Otp: ",user.resetOtp, " Entered Otp: ", otp);
       
        if(String(user.resetOtp) !== String(otp) || user.resetOtp === ''){
            return res.status(400).json({message:'Invalid OTP'});
        }
         if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({message:'OTP expired'});
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.status(200).json({message:'Password reset successfully'});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}