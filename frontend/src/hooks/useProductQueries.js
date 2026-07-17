import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";

// Query to fetch featured products (cached)
export const useFeaturedProductsQuery = () => {
	return useQuery({
		queryKey: ["products", "featured"],
		queryFn: async () => {
			const res = await axios.get("/products/featured");
			return res.data;
		},
	});
};

// Query to fetch filtered products with dynamic criteria (cached by active filters)
export const useFilteredProductsQuery = (filters = {}) => {
	const { category, minPrice, maxPrice, search, sort } = filters;
	return useQuery({
		queryKey: ["products", "filtered", { category, minPrice, maxPrice, search, sort }],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (category && category !== "all") {
				params.append("category", category);
			}
			if (minPrice) {
				params.append("minPrice", minPrice);
			}
			if (maxPrice) {
				params.append("maxPrice", maxPrice);
			}
			if (search) {
				params.append("search", search);
			}
			if (sort) {
				params.append("sort", sort);
			}

			const res = await axios.get(`/products/filtered?${params.toString()}`);
			return res.data.products;
		},
		placeholderData: (previousData) => previousData,
	});
};

// Query to fetch products belonging to a specific category
export const useProductsByCategoryQuery = (category) => {
	return useQuery({
		queryKey: ["products", "category", category],
		queryFn: async () => {
			const res = await axios.get(`/products/category/${category}`);
			return res.data.products;
		},
		enabled: !!category,
	});
};

// Query to fetch details of a single product
export const useProductDetailsQuery = (productId) => {
	return useQuery({
		queryKey: ["products", "details", productId],
		queryFn: async () => {
			const res = await axios.get(`/products/${productId}`);
			return res.data;
		},
		enabled: !!productId,
	});
};

// Query to fetch product recommendations
export const useRecommendationsQuery = () => {
	return useQuery({
		queryKey: ["products", "recommendations"],
		queryFn: async () => {
			const res = await axios.get("/products/recommendations");
			return res.data;
		},
	});
};
