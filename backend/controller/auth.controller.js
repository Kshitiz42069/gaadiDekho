import User from "../models/User.js";
import generateToken from "../utils/generateTokens.js";

export const signUp = async(req,res)=>{
    try {
        const {fullname,email,password,confirmPassword} = req.body;
        if(password !== confirmPassword){
            return res.status(201).json({message:"Password does not match"});
        }
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"User already exist!"});
        }

        const newUser = new User({
            fullname,
            email,
            password
        });

        //hashed password add if got time


        if(newUser){
            //jwt token is yet to be added
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(200).json({
                fullname:newUser.fullname,
                email:newUser.email,
                password:newUser.password
            });
        }
        else{
            return res.status(404).json({error:"invalid user data"})
        }
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
        console.log(error);
    }
}
export const logIn = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user =await User.findOne({email});
        //hashed password 
        const isPassword = password === (user?.password || '');
        if(!user || !isPassword){
            return res.status(201).json({message:'invalid credentails'});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            password:user.password
        });

    } catch (error) {
        res.status(500).json({errro:"internal server error"});
        console.log(error);
    }
}


//apprach after generating cookies
export const logOut = async(req,res)=>{
    try {
        res.status(200).json({message:'logout successfull'});
    } catch (error) {
        res.status(500).json({error:"internal server error"});
        console.log(error);
    }
}