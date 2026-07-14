import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PurchaseCancelPage = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-900 text-white px-4'>
			<motion.div
				className='max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center'
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className='flex justify-center mb-6'>
					<XCircle className='text-red-500 w-16 h-16 animate-pulse' />
				</div>
				<h1 className='text-3xl font-extrabold text-red-500 mb-2'>Payment Canceled</h1>
				<p className='text-gray-300 mb-6'>
					Your payment process was canceled. No charges were made, and your cart items are still saved.
				</p>

				<div className='bg-gray-700 rounded-lg p-4 mb-8 text-left'>
					<p className='text-sm text-gray-300'>
						If you encountered any issues during checkout, please feel free to try again or reach out to our customer support.
					</p>
				</div>

				<div className='flex flex-col gap-3'>
					<Link
						to='/cart'
						className='flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
					>
						<ArrowLeft className='mr-2' size={18} />
						Return to Cart
					</Link>
					<Link
						to='/'
						className='flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-semibold py-3 px-6 rounded-lg transition-colors'
					>
						Back to Shop
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
