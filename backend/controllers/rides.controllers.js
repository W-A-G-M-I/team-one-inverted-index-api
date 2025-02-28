import Ride from '../models/ride.model.js';
import mongoose from 'mongoose'
export  const getProducts = async (req, res) => {
    try {
       const products = await Ride.find({})
       res.status(200).json({success: true, data: products})
    } catch (error) {
       console.log('Error fetching products', error);
       res.status(500).json({success: false, message: 'Internal server error'})
    }
 }

 export const getProductById = async (req, res) => {
    const {id} = req.params
    try {
       const product = await Ride.findById(id)
       res.status(200).json({success: true, data: product})
    } catch (error) {
       console.log('Error fetching products', error);
       res.status(500).json({success: false, message: 'Internal server error'})
    }
 }

 export const createProduct = async (req,res) => {
    const product = req.body //user will send the data to the server
 
    if(!product.name || !product.price || !product.image || !product.type  || !product.year) {
       return res.status(400).json({success: false, message: 'Please fill all the fields'})
    }
    const newProduct = new Ride(product)
 
    try {
       await newProduct.save()
       res.status(201).json({success: true, data: newProduct, message: 'Product created successfully'})
    } catch (error) {
     console.log('Error craeting product', error);
       res.status(500).json({success: false, message: 'Internal server error'})
    }
 }

 export const updateProduct = async (req, res) => {
    const {id} = req.params
   //  const product = req.body
   const {name, price, image, type, year} = req.body
    if(!mongoose.Types.ObjectId.isValid(id)){
     return res.status(404).json({success:false, message: 'No Product of such exist'})
    }
    
    try {
       let updatedProduct = await Ride.findById(id)
       if(!updatedProduct){
        return res.status(404).json({success:false, message: 'No Product of such exist'})
       }
       updatedProduct.name = name || updatedProduct.name
       updatedProduct.price = price || updatedProduct.price
       updatedProduct.image = image || updatedProduct.image
       updatedProduct.type = type || updatedProduct.type
       updatedProduct.year = year || updatedProduct.year

       updatedProduct = await updatedProduct.save()
       res.status(200).json({ message: 'Post updated successfully',  updatedProduct });
      //  res.status(200).json({success: true, data: updatedProduct, message: 'Product updated successfully'})
    } catch (error) {
       console.log('Error updating product', error);
       res.status(500).json({success: false, message: 'Internal server error'})
    }
 }

 export const deleteProduct = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
       return res.status(404).json({success:false, message: 'Invalid product id'})
       }
   try {
      await Ride.findByIdAndDelete(id)
      res.status(200).json({success: true, message: 'Product deleted successfully'})
   } catch (error) {
      console.log('Error deleting product', error);
      res.status(500).json({success: false, message: 'Internal server error'})
   }
}

export const searchRides = async (req, res) => {
   const { query } = req.query;
 
   try {
     if (!query) {
       return res.status(400).json({ success: false, message: "Search query is required" });
     }
     
     const rides = await Ride.find(
       { name: { $regex: new RegExp(query, "i") } }
     );
 
     res.status(200).json({ success: true, data: rides });
   } catch (error) {
     console.error("Error searching rides:", error);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 };
 