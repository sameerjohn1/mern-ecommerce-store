import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [orderId, setOrderId] = useState(null);
	const clearCart = useCartStore((state) => state.clearCart);
	const verifyingRef = useRef(false);

	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const handleCheckoutSuccess = async () => {
			const sessionId = searchParams.get("session_id");
			if (!sessionId) {
				setLoading(false);
				setError("No session ID found in the URL.");
				return;
			}

			if (verifyingRef.current) return;
			verifyingRef.current = true;

			try {
				const response = await axios.post("/payments/checkout-success", { sessionId });
				setOrderId(response.data.orderId);
				clearCart();
			} catch (err) {
				console.error("Error verifying checkout session:", err);
				setError(err.response?.data?.message || "Failed to verify the purchase. Please contact support.");
			} finally {
				setLoading(false);
			}
		};

		handleCheckoutSuccess();
	}, [searchParams, clearCart]);

	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white'>
				<div className='relative mb-4'>
					<div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />
					<div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
				</div>
				<p className='text-emerald-400 font-medium text-lg'>Confirming payment...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-900 text-white px-4'>
				<div className='max-w-md w-full bg-gray-800 border border-red-500 rounded-2xl p-8 shadow-2xl text-center'>
					<div className='flex justify-center text-red-500 mb-4'>
						<svg className='h-16 w-16' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' />
						</svg>
					</div>
					<h1 className='text-2xl font-bold text-red-500 mb-2'>Verification Error</h1>
					<p className='text-gray-300 mb-6'>{error}</p>
					<Link
						to='/cart'
						className='inline-flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
					>
						Back to Cart
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-900 text-white px-4 relative overflow-hidden'>
			<Confetti
				width={windowSize.width}
				height={windowSize.height}
				numberOfPieces={150}
				recycle={false}
				style={{ zIndex: 100 }}
			/>

			<div className='max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl text-center relative z-10'>
				<div className='flex justify-center mb-6'>
					<CheckCircle className='text-emerald-500 w-16 h-16 animate-bounce' />
				</div>
				<h1 className='text-3xl font-extrabold text-emerald-400 mb-2'>Purchase Successful!</h1>
				<p className='text-gray-300 mb-4'>
					Thank you for your order! We appreciate your business and are already preparing your package.
				</p>
				<p className='text-emerald-400 text-sm font-semibold mb-6'>
					Check your email for details and updates.
				</p>

				{orderId && (
					<div className='bg-gray-700 rounded-lg p-4 mb-8 text-left'>
						<div className='text-xs text-gray-400 font-bold uppercase tracking-wider mb-1'>Order ID</div>
						<div className='text-sm font-mono text-emerald-300 truncate'>{orderId}</div>
					</div>
				)}

				<div className='flex flex-col gap-3'>
					<Link
						to='/'
						className='flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
					>
						Continue Shopping
						<ArrowRight className='ml-2' size={18} />
					</Link>
					<Link
						to='/cart'
						className='flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-semibold py-3 px-6 rounded-lg transition-colors'
					>
						<ShoppingBag className='mr-2' size={18} />
						Go to Cart
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;
