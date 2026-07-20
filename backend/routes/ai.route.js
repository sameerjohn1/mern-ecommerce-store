import express from "express";
import { handleAiChat } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", handleAiChat);

export default router;
