import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import ShopModel from "./models/Shop.js";
import ProductModel from "./models/Product.js";
import OrderModel from "./models/Order.js";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/shops", async (req, res) => {
  const shops = await ShopModel.find();

  res.json(shops);
});

app.get("/shops/:title/products", async (req, res) => {
  const products = await ProductModel.find({ seller: req.params.title });

  res.json(products);
});

app.post("/order", async (req, res) => {
  try {
    await OrderModel.create({
      ...req.body,
    });
  } catch (err) {
    return res.status(402).send("Error creating order: ", err);
  }
  res.send("Created new order");
});

app.listen(5000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server has started on port 5000");
});
