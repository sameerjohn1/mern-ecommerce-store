import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  filteredProducts: [],
  isFilteredLoading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
  currentProduct: null,
  fetchProductById: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/${productId}`);
      set({ currentProduct: response.data, loading: false });
    } catch (error) {
      set({ currentProduct: null, loading: false });
      toast.error(error.response?.data?.message || "Failed to fetch product details");
    }
  },
  fetchFilteredProducts: async (filters = {}) => {
    set({ isFilteredLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.minPrice) {
        params.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.sort) {
        params.append("sort", filters.sort);
      }

      const response = await axios.get(`/products/filtered?${params.toString()}`);
      set({ filteredProducts: response.data.products, isFilteredLoading: false });
    } catch (error) {
      set({ filteredProducts: [], isFilteredLoading: false });
      toast.error(error.response?.data?.message || "Failed to fetch filtered products");
    }
  },
}));

