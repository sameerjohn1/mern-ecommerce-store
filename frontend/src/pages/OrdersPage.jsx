import { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Calendar, CreditCard, CheckCircle } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const OrdersPage = () => {
	const { orders, loading, fetchOrders } = useOrderStore();

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	if (loading) return <LoadingSpinner />;

	return (
		<div className='min-h-screen py-16'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-12 tracking-tight'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					My Orders
				</motion.h1>

				{orders.length === 0 ? (
					<EmptyOrdersUI />
				) : (
					<motion.div
						className='space-y-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{orders.map((order) => (
							<OrderCard key={order._id} order={order} />
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;

const OrderCard = ({ order }) => {
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 rounded-xl p-6 shadow-2xl hover:border-emerald-500 transition-all duration-300'
			whileHover={{ y: -4 }}
			transition={{ duration: 0.2 }}
		>
			{/* Order Header info */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-gray-700 gap-4'>
				<div>
					<span className='text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1'>
						Order Reference
					</span>
					<span className='font-mono text-sm text-gray-300 break-all'>{order._id}</span>
				</div>
				<div className='flex flex-wrap gap-4 items-center'>
					<div className='flex items-center text-gray-400 text-sm'>
						<Calendar className='w-4 h-4 mr-1.5 text-emerald-500' />
						<span>{formatDate(order.createdAt)}</span>
					</div>
					<span className='inline-flex items-center gap-1 bg-emerald-500 bg-opacity-15 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-500 border-opacity-30'>
						<CheckCircle className='w-3.5 h-3.5' />
						Paid
					</span>
				</div>
			</div>

			{/* Products list */}
			<div className='space-y-4 mb-6'>
				{order.products.map((item) => {
					// Fallback if product was deleted or is not fully loaded
					const product = item.product || {
						name: "Unknown Product",
						image: "https://via.placeholder.com/150",
						price: item.price,
					};

					return (
						<div key={item._id || item.product?._id} className='flex items-center justify-between gap-4'>
							<div className='flex items-center gap-4'>
								<img
									src={product.image}
									alt={product.name}
									className='w-16 h-16 object-cover rounded-lg border border-gray-700 bg-gray-900 flex-shrink-0'
								/>
								<div>
									<h4 className='text-base font-semibold text-gray-100 hover:text-emerald-400 transition-colors line-clamp-1'>
										{product.name}
									</h4>
									<p className='text-sm text-gray-400 mt-0.5'>
										Qty: <span className='font-medium text-gray-300'>{item.quantity}</span>
									</p>
								</div>
							</div>
							<div className='text-right'>
								<p className='text-sm text-gray-400 font-mono'>${product.price?.toFixed(2)}</p>
								<p className='text-base font-semibold text-emerald-400 font-mono mt-0.5'>
									${(product.price * item.quantity).toFixed(2)}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Order Footer - Total amount */}
			<div className='flex justify-between items-center pt-4 border-t border-gray-700'>
				<div className='flex items-center text-gray-400 text-sm'>
					<CreditCard className='w-4 h-4 mr-1.5 text-emerald-500' />
					<span>Payment Method: Card</span>
				</div>
				<div className='text-right'>
					<span className='text-xs text-gray-400 uppercase tracking-wider block mb-1'>Total Paid</span>
					<span className='text-2xl font-extrabold text-emerald-400 font-mono'>
						${order.totalAmount?.toFixed(2)}
					</span>
				</div>
			</div>
		</motion.div>
	);
};

const EmptyOrdersUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-6 py-20 bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-xl p-8 text-center'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='p-4 bg-emerald-500 bg-opacity-10 rounded-full border border-emerald-500 border-opacity-20 animate-pulse'>
			<ShoppingBag className='h-16 w-16 text-emerald-400' />
		</div>
		<div>
			<h3 className='text-2xl font-bold text-gray-100'>No orders placed yet</h3>
			<p className='text-gray-400 mt-2 max-w-sm mx-auto'>
				It seems you haven't bought anything from our store yet. Go find something you like!
			</p>
		</div>
		<Link
			className='inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3 text-white font-semibold shadow-lg hover:bg-emerald-500 active:scale-95 transition-all duration-200'
			to='/'
		>
			Start Shopping
		</Link>
	</motion.div>
);
