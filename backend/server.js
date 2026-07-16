import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import orderRoutes from "./routes/order.route.js";
import { handleWebhook } from "./controllers/payment.controller.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Webhook must be registered BEFORE express.json() to capture raw request body for verification
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleWebhook);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is listen on port http://localhost:${PORT}`);

  connectDb();
});
