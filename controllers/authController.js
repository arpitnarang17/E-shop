import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import  JWT from "jsonwebtoken";

export const registerController=async(req,res)=>{
    try {
        const {name,email,password,phone,address,answer}=req.body
        if(!name){
            return res.send({message:'Name is Required'});
        }
        if(!email){
            return res.send({message:'Email is Required'});
        }
        if(!password){
            return res.send({message:'Password is Required'});
        }
        if(!phone){
            return res.send({message:'Phone number is Required'});
        }
        if(!address){
            return res.send({message:'Address is Required'});
        }
        if(!answer){
            return res.send({message:'Answer is Required'});
        }
        const exisitingUser =await userModel.findOne({email})
         if(exisitingUser){
            return res.status(200).send({
                success:flase,
                message:'Already Register please login',
            })
         }
        const hashedPassword=await hashPassword(password);
        const user= await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer,
        }).save();
        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user,
        });
    } catch(error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'User cannot be register,Please try again later',
            error,
        });
    }
};
  
export const loginController=async (req,res) => {
    try {
      const {email,password}=req.body
      if(!email || !password){
        return res.status(404).send({
            success:false,
            message:'Invalid email or password'
        })
      }
      const user =await userModel.findOne({email})
      if(!user){
        return res.status(404).send({
            success:false,
            message:'Email is not registered'
        })
      }
      const match= await comparePassword(password,user.password)
      if(!match){
        return res.status(200).send({
            success:false,
            message:'Invalid Passwword'
        })
      }
      const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d",});
      res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },
        token,
      });
    } catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error,
        });
    }
};
export const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Emai is required" });
      }
      if (!answer) {
        res.status(400).send({ message: "answer is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, answer });
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };
  






export const testController=(req,res)=>{
    res.send("Protected  Routes");
};