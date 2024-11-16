import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    features:{
        type:[String],
        required:true
    },
    productImages:{
        type:[String],
        required:true,
        validate: [arrayList,'{PATH} exceeds the limit of 10']
    },
    tags:{
        type:[String],
        require:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
},{
    timestamps:true
});

function arrayList(val){
    return val.length <= 10;
}

const Product = mongoose.model('Product',productSchema);

export default Product;