import userModel from "../models/userModel.js";

export const getUserData= async (req,res)=>{
    // console.log("Incoming body:", req.body);

    try{
       /* const {userId} = req.body;
        if(!userId){
            return res.status(400).json({message:'User ID is required'});
        }*/
        const user= await userModel.findById(req.user.id).select("-password");
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        return res.status(200).json({userData:{
            name:user.name,
            email:user.email,
            isAccountVerified:user.isAccountVerified
        }});
    }catch(error){
        console.error('Error in getUserData:', error);
        return res.status(500).json({message:'Server Error in userController'});
    }   
};