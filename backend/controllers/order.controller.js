import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate("products.product")
			.sort({ createdAt: -1 });

		res.status(200).json(orders);
	} catch (error) {
		console.log("Error in getMyOrders:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
