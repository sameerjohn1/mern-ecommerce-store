import { useEffect, useState } from "react";
import { useFeaturedProductsQuery, useFilteredProductsQuery } from "../hooks/useProductQueries";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductCard from "../components/ProductCard";
import FilterSelector from "../components/FilterSelector";
import HeroSection from "../components/HeroSection";
import { Search, RotateCcw } from "lucide-react";

// Predefined Filter Options (Passed to FilterSelector as props)
const categoryOptions = [
	{ id: "jeans", label: "Jeans" },
	{ id: "t-shirts", label: "T-shirts" },
	{ id: "shoes", label: "Shoes" },
	{ id: "glasses", label: "Glasses" },
	{ id: "jackets", label: "Jackets" },
	{ id: "suits", label: "Suits" },
	{ id: "bags", label: "Bags" },
];

const priceRanges = [
	{ id: "under_25", label: "Under $25", min: 0, max: 25 },
	{ id: "25_50", label: "$25 - $50", min: 25, max: 50 },
	{ id: "50_100", label: "$50 - $100", min: 50, max: 100 },
	{ id: "100_200", label: "$100 - $200", min: 100, max: 200 },
	{ id: "200_above", label: "$200 & Above", min: 200, max: 1000000 },
];

const sortOptions = [
	{ id: "newest", label: "Newest Arrivals" },
	{ id: "title_asc", label: "Title: A to Z" },
	{ id: "title_desc", label: "Title: Z to A" },
	{ id: "price_asc", label: "Price: Low to High" },
	{ id: "price_desc", label: "Price: High to Low" },
];

const ProductSkeleton = () => (
	<div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-800/40 animate-pulse h-[400px]">
		<div className="relative mx-3 mt-3 h-60 rounded-xl bg-gray-750" style={{ backgroundColor: "#374151" }} />
		<div className="mt-4 px-5 pb-5 flex-1 flex flex-col justify-between">
			<div className="space-y-3">
				<div className="h-6 bg-gray-700 rounded w-3/4" />
				<div className="h-8 bg-gray-700 rounded w-1/4" />
			</div>
			<div className="h-10 bg-gray-700 rounded w-full mt-auto" />
		</div>
	</div>
);

const HomePage = () => {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	
	// Filter state managed in HomePage and passed down
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
	const [sort, setSort] = useState("newest");

	// Bounding limits state derived from selectedPriceRanges
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");

	// Debounce search term
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 400);

		return () => {
			clearTimeout(handler);
		};
	}, [search]);

	// React Query hooks for cached fetching
	const { data: products = [], isLoading } = useFeaturedProductsQuery();

	const { data: filteredProducts = [], isLoading: isFilteredLoading } = useFilteredProductsQuery({
		category: selectedCategories.length > 0 ? selectedCategories.join(",") : "all",
		minPrice,
		maxPrice,
		search: debouncedSearch,
		sort,
	});

	// Handler passed as prop to price selector to calculate bounding ranges
	const handlePriceChange = (updatedRanges) => {
		setSelectedPriceRanges(updatedRanges);

		if (updatedRanges.length === 0) {
			setMinPrice("");
			setMaxPrice("");
		} else {
			const activeRanges = priceRanges.filter((r) => updatedRanges.includes(r.id));
			const mins = activeRanges.map((r) => r.min);
			const maxs = activeRanges.map((r) => r.max);
			const overallMin = Math.min(...mins);
			const overallMax = Math.max(...maxs);

			setMinPrice(overallMin === 0 && overallMax === 1000000 ? "" : overallMin.toString());
			setMaxPrice(overallMax === 1000000 ? "" : overallMax.toString());
		}
	};

	const handleResetFilters = () => {
		setSearch("");
		setSelectedCategories([]);
		setSelectedPriceRanges([]);
		setMinPrice("");
		setMaxPrice("");
		setSort("newest");
	};

	return (
		<div className='relative min-h-screen text-white overflow-hidden bg-gray-950'>
			<HeroSection />
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				
				{/* SHOP COLLECTION SECTION */}
				<div className='mb-20' id="collection">
					<div className='mb-8 text-center'>
						<h1 className='text-5xl sm:text-6xl font-bold text-emerald-400 mb-4 tracking-tight'>
							Our Collection
						</h1>
						<p className='text-xl text-gray-300 max-w-2xl mx-auto'>
							Browse and filter our premium clothing line to find the latest trends in eco-friendly fashion
						</p>
					</div>

					{/* Search & Filters Bar (z-30 lifts this container above product card grids) */}
					<div className="relative z-30 bg-gray-800/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-gray-700/85 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
						{/* Search input on the left */}
						<div className="relative flex-1 max-w-md w-full">
							<input
								type="text"
								placeholder="Search products by name or description..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full bg-gray-900/60 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 placeholder-gray-500 text-sm"
							/>
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
						</div>

						{/* Reusable Custom Select Dropdowns on the right */}
						<div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
							
							{/* Category Selector */}
							<FilterSelector
								label="Category"
								options={categoryOptions}
								selectedValues={selectedCategories}
								onChange={setSelectedCategories}
								isMultiSelect={true}
								placeholderAll="All Categories"
							/>

							{/* Price Range Selector */}
							<FilterSelector
								label="Price"
								options={priceRanges}
								selectedValues={selectedPriceRanges}
								onChange={handlePriceChange}
								isMultiSelect={true}
								placeholderAll="All Prices"
							/>

							{/* Sort Selector */}
							<FilterSelector
								label="Sort By"
								options={sortOptions}
								selectedValues={sort}
								onChange={setSort}
								isMultiSelect={false}
							/>

							{/* Reset Button */}
							<button
								onClick={handleResetFilters}
								className="p-3 bg-gray-900/60 hover:bg-emerald-600/20 text-gray-400 hover:text-emerald-400 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 flex items-center justify-center"
								title="Clear Filters"
							>
								<RotateCcw size={18} />
							</button>
						</div>
					</div>

					{/* Products Grid */}
					<div className="w-full">
						{isFilteredLoading ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full'>
								{[...Array(8)].map((_, index) => (
									<ProductSkeleton key={index} />
								))}
							</div>
						) : filteredProducts.length === 0 ? (
							<div className="text-center py-20 bg-gray-800/20 rounded-xl border border-dashed border-gray-800 flex flex-col items-center justify-center">
								<Search size={48} className="text-gray-600 mb-4 animate-pulse" />
								<h3 className="text-xl font-bold text-gray-300 mb-2">No Products Found</h3>
								<p className="text-gray-500 max-w-sm">
									We couldn't find any products matching your filters. Try search words or clear all filters.
								</p>
								<button
									onClick={handleResetFilters}
									className="mt-6 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
								>
									Clear All Filters
								</button>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full">
								{filteredProducts.map((product) => (
									<ProductCard key={product._id} product={product} />
								))}
							</div>
						)}
					</div>
				</div>

				{/* FEATURED PRODUCTS SECTION */}
				{!isLoading && products.length > 0 && (
					<div className="mt-16 pt-16 border-t border-gray-800">
						<FeaturedProducts featuredProducts={products} />
					</div>
				)}

			</div>
		</div>
	);
};

export default HomePage;