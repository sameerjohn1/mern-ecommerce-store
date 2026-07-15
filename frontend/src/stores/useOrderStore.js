import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
	orders: [],
	loading: false,

	fetchOrders: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/orders");
			set({ orders: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch orders");
		}
	},
}));
