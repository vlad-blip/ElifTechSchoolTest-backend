import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  title: String,
});

export default mongoose.model("Shop", ShopSchema, "shop");
