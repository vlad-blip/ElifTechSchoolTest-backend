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
    if (req.body.credentials && req.body.cart) {
      await OrderModel.create(req.body);
    } else {
      throw new Error(
        "Order should only contain credentials and cart properties"
      );
    }
  } catch (err) {
    return res.status(400).send(`Error creating order: ${err.message}`);
  }
  res.send("Created new order");
});

app.post("/history", async (req, res, next) => {
  try {
    const order = await OrderModel.find({
      $or: [
        { "credentials.0.email": req.body.email },
        { "credentials.0.phone": req.body.phone },
      ],
    });

    if (order.length === 0) {
      throw new Error("Order doesn't exist");
    }

    const orderList = order.map((order) => order.cart[0]);

    res.json(orderList);
  } catch (err) {
    return res.status(400).send(`Error getting history: ${err.message}`);
  }
});

const COUPONS = [
  { code: "MINUS_15", description: "Get 15$ discount", discount: 15 },
  { code: "MINUS_10", description: "Get 10$ discount", discount: 10 },
  { code: "MINUS_20", description: "Get 20$ discount", discount: 20 },
];

app.get("/coupons", async (req, res) => {
  res.json(COUPONS);
});

app.get("/coupons/:couponCode", async (req, res) => {
  const exsiting = COUPONS.find(
    (coupon) => coupon.code === req.params.couponCode
  );

  if (exsiting) {
    res.json({ discount: exsiting.discount });
  } else {
    res.status(400).send("Invalid coupon");
  }
});

app.listen(5000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server has started on port 5000");
});
