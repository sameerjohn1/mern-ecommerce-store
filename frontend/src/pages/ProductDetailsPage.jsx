import { useParams, Link } from "react-router-dom";
import { useProductDetailsQuery } from "../hooks/useProductQueries";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
	const { id } = useParams();
	const { data: currentProduct, isLoading } = useProductDetailsQuery(id);
	const { addToCart } = useCartStore();
	const { user } = useUserStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(currentProduct);
	};

	if (isLoading) return <LoadingSpinner />;

	if (!currentProduct) {
		return (
			<div className='min-h-screen flex flex-col items-center justify-center space-y-4 px-4 text-center'>
				<h2 className='text-3xl font-bold text-gray-300'>Product Not Found</h2>
				<p className='text-gray-400 max-w-sm'>
					The product you are looking for does not exist or may have been removed.
				</p>
				<Link
					to='/'
					className='inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold'
				>
					<ArrowLeft className='mr-2 w-4 h-4' /> Back to Home
				</Link>
			</div>
		);
	}

	return (
		<div className='min-h-screen py-12 md:py-20'>
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				{/* Back link */}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className='mb-8'
				>
					<Link
						to='/'
						className='inline-flex items-center text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm font-medium'
					>
						<ArrowLeft className='mr-2 w-4.5 h-4.5' />
						Back to Shopping
					</Link>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 sm:p-10 shadow-2xl'>
					{/* Image section */}
					<motion.div
						className='overflow-hidden rounded-xl border border-gray-700 bg-gray-900 flex items-center justify-center max-h-[450px]'
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
					>
						<img
							src={currentProduct.image}
							alt={currentProduct.name}
							className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
						/>
					</motion.div>

					{/* Content section */}
					<motion.div
						className='flex flex-col justify-between'
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<div>
							{/* Category badge */}
							<span className='inline-block bg-emerald-500 bg-opacity-15 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500 border-opacity-20 uppercase tracking-wider mb-4'>
								{currentProduct.category}
							</span>

							<h1 className='text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight'>
								{currentProduct.name}
							</h1>

							<p className='text-3xl font-extrabold text-emerald-400 font-mono mb-6'>
								${currentProduct.price?.toFixed(2)}
							</p>

							<h3 className='text-gray-300 font-semibold mb-2 text-lg'>Description</h3>
							<p className='text-gray-400 text-base leading-relaxed mb-8'>
								{currentProduct.description || "No description available for this product."}
							</p>
						</div>

						<div>
							<button
								onClick={handleAddToCart}
								className='flex items-center justify-center w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg active:scale-95 transition-all duration-200'
							>
								<ShoppingCart size={22} className='mr-2' />
								Add to Cart
							</button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetailsPage;
