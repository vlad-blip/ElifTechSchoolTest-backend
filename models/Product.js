import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  seller: String,
});

export default mongoose.model("Product", ProductSchema, "product");
