import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", protectRoute, getMyOrders);

export default router;
