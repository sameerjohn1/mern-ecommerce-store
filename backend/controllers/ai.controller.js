import axios from "axios";
import Product from "../models/product.model.js";

export const handleAiChat = async (req, res) => {
	try {
		const { messages } = req.body;

		if (!messages || !Array.isArray(messages)) {
			return res.status(400).json({ message: "Invalid messages format" });
		}

		// Fetch active products from MongoDB to construct store catalog context
		let products = [];
		try {
			products = await Product.find({}).select("name price category description image _id").lean();
		} catch (dbErr) {
			console.warn("Could not query DB products for AI context:", dbErr.message);
		}

		const catalogContext = products.length > 0
			? products
					.map(
						(p) => `- ID: ${p._id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price} | Desc: ${p.description}`
					)
					.join("\n")
			: "No items currently in store.";

		const systemPrompt = `You are "StyleBot", the friendly, expert AI Shopping Assistant & Personal Stylist for our E-Commerce Store.
Your job is to help customers find fashion items, answer questions, provide outfit recommendations, and guide them through our catalog.

LIVE STORE CATALOG PRODUCTS:
${catalogContext}

INSTRUCTIONS & GUIDELINES:
1. Be friendly, polite, stylish, and helpful.
2. Recommend products directly from the catalog above whenever relevant to the user's inquiry.
3. Mention exact product names and prices ($) in your advice.
4. If you recommend specific products from the catalog, output their exact Mongo IDs in a structured JSON line at the VERY END of your message in this exact format:
RECOMMENDED_IDS: ["id1", "id2"]
5. Keep your chat text engaging, concise, and easy to read.`;

		// Try active free models sequentially if one fails
		const candidateModels = [
			"openrouter/free",
			"google/gemma-4-26b-a4b-it:free",
			"openai/gpt-oss-20b:free",
		];

		let response = null;
		let lastError = null;

		for (const model of candidateModels) {
			try {
				response = await axios.post(
					"https://openrouter.ai/api/v1/chat/completions",
					{
						model,
						messages: [
							{ role: "system", content: systemPrompt },
							...messages.slice(-8),
						],
					},
					{
						headers: {
							Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
							"HTTP-Referer": "http://localhost:5173",
							"X-Title": "MERN E-Commerce AI Assistant",
							"Content-Type": "application/json",
						},
						timeout: 20000,
					}
				);
				if (response?.data?.choices?.[0]?.message?.content) {
					console.log(`[StyleBot AI] Successfully generated response using model: ${model}`);
					break;
				}
			} catch (err) {
				console.warn(`[StyleBot AI] Model ${model} failed:`, err.response?.data?.error?.message || err.message);
				lastError = err;
			}
		}

		if (!response) {
			throw lastError || new Error("All AI model attempts failed.");
		}

		const rawContent = response.data?.choices?.[0]?.message?.content || "I am currently unable to process that request. Please try again!";

		// Extract recommended product IDs if present
		let recommendedProducts = [];
		const match = rawContent.match(/RECOMMENDED_IDS:\s*(\[.*?\])/s);
		if (match) {
			try {
				const ids = JSON.parse(match[1]);
				recommendedProducts = products.filter((p) => ids.includes(p._id.toString()));
			} catch (parseErr) {
				console.error("Error parsing recommended IDs:", parseErr);
			}
		}

		const cleanMessage = rawContent.replace(/RECOMMENDED_IDS:\s*(\[.*?\])/s, "").trim();

		return res.json({
			message: cleanMessage,
			recommendedProducts,
		});
	} catch (error) {
		console.error("Error in AI controller:", error.response?.data || error.message);
		return res.status(500).json({
			message: "StyleBot is experiencing high demand right now. Please ask again in a few seconds!",
			error: error.message,
		});
	}
};
