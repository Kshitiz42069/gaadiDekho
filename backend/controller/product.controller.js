import mongoose from "mongoose";
import Product from "../models/Product.js";

export const createProduct = async(req,res)=>{
    const {title,features,productImages,tags} = req.body;
    const ownerId = req.user?._id;

    if(!ownerId){
        return res.status(401).json({message:'unauthorised, Please log in.'});
    }

    if(!title || !features || !Array.isArray(features) || !Array.isArray(productImages)){
        return res.status(401).json({message:'Invalid input, check title,features and productImages'});
    }

    if(productImages.length>10){
        return res.status(401).json({message:'you can only upload up to 10 images'});
    }
    try {
        const newProduct = await Product.create({
            title,
            features,
            productImages,
            tags,
            owner:ownerId
        });

        res.status(201).json({
            message:"product added",
            product: newProduct
        })
    } catch (error) {
        res.status(500).json({error:'internal server error'});
        console.log(error);
    }
}
export const allProduct = async(req,res)=>{
    try {
        const {page=1,limit=12,search=''} = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 12;

        const skip = (pageNum-1)*limitNum;

        const searchQuery = search
        ? {
            $or:[
                {title:{$regex:search,$options:'i'}},
                {features:{$regex:search,$options:'i'}},
                {tags:{$regex:search,$options:'i'}},
            ]
        }:{};

        const products = await Product.find(searchQuery)
        .populate("owner","email")
        .skip(skip)
        .limit(limitNum)
        .sort({createdAt:-1});

        const totalProducts = await Product.countDocuments();
        res.status(200).json({
            message:"products fetched successfully",
            products,
            pagination:{
                totalProducts,
                currentPage: pageNum,
                totalPages: Math.ceil(totalProducts/limit),
            },
        });
    } catch (error) {
        res.status(500).json({error:"internal server error"});
        console.log(error);
    }
}
export const productDetail = async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'Invalid product Id'});
    }
    try {
        const product = await Product.findById(id).populate("owner","email");

        if(!product){
            return res.status(404).json({message:'producet not found'});
        }
        res.status(200).json({
            message:'product detail fetched successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({error:'Internval Server Error'});
        console.log(error);
    }
}
export const updateProduct = async(req,res)=>{
    const {id} = req.params;
    const {title,features,productImages,tags} = req.body;
    const ownerId = req.user?.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'invalid product id'});
    }

    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:'product not found'});
        }
        if(product.owner.toString() !== ownerId){
            return res.status(403).json({message:"you are not authorized"});
        }
        if(productImages && productImages.length>10){
            return res.status(400).json({message:'you can only upload add upto 10 photos'});
        }

        product.title = title || product.title;
        product.features = features || product.features;
        product.productImages = productImages || product.productImages;
        product.tags = tags || product.tags;

        const updatedProduct = await product.save();

        res.status(200).json({
            message:"Product updatged successfully",
            product:updatedProduct
        })
    } catch (error) {
        res.status(500).json({error:'Internal server error'});
        console.log(error);
    }
}
export const deleteProduct = async(req,res)=>{
    const {id} = req.params;
    const ownerId = req.user?._id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'invalid product id'});
    }

    try {
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message:'product not found'});
        }

        if(product.owner.toString() !== ownerId.toString()){
            return res.status(403).json({message:'you are not authorised to delete this product'});
        }
        await product.deleteOne();

        res.status(200).json({
            message:'product is removed successfully'
        })
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"});
        console.log(error);
    }
}