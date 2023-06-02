import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
  credentials: Array,
  cart: Array,
});

export default mongoose.model("Order", OrderSchema);
