import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Sparkles,
	X,
	Send,
	Bot,
	User,
	ShoppingBag,
	RotateCcw,
	ChevronRight,
	ExternalLink,
	MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

const QUICK_PROMPTS = [
	"🔥 What are the top trending items?",
	"💰 Show me budget deals under $50",
	"👟 Recommend stylish shoes & accessories",
	"👔 What's best for a party or formal occasion?",
];

const AiChatbot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: "welcome-1",
			role: "assistant",
			content:
				"Hi there! 👋 I am **StyleBot**, your personal AI Shopping Assistant. Ask me anything about our clothing, trends, or fashion recommendations!",
			recommendedProducts: [],
		},
	]);
	const [inputPrompt, setInputPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (isOpen) {
			scrollToBottom();
		}
	}, [messages, loading, isOpen]);

	const handleSend = async (textToSend) => {
		const query = textToSend || inputPrompt;
		if (!query.trim() || loading) return;

		const userMsg = {
			id: Date.now().toString(),
			role: "user",
			content: query,
		};

		const updatedHistory = [...messages, userMsg];
		setMessages(updatedHistory);
		setInputPrompt("");
		setLoading(true);

		try {
			// Format history for backend API context
			const apiMessages = updatedHistory.map((msg) => ({
				role: msg.role,
				content: msg.content,
			}));

			const res = await axios.post("/ai/chat", { messages: apiMessages });

			const botMsg = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: res.data.message || "Here is what I found for you!",
				recommendedProducts: res.data.recommendedProducts || [],
			};

			setMessages((prev) => [...prev, botMsg]);
		} catch (error) {
			console.error("Error sending message to AI:", error);
			const errorMsg = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: "Oops! I encountered an error fetching recommendations. Please try asking again in a moment.",
				recommendedProducts: [],
			};
			setMessages((prev) => [...prev, errorMsg]);
		} finally {
			setLoading(false);
		}
	};

	const handleClearHistory = () => {
		setMessages([
			{
				id: "welcome-1",
				role: "assistant",
				content:
					"Chat history reset! ✨ How can I help you find the perfect outfit today?",
				recommendedProducts: [],
			},
		]);
	};

	return (
		<div className='fixed bottom-6 right-6 z-50 select-none'>
			{/* Floating Launcher Button */}
			<AnimatePresence>
				{!isOpen && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						whileHover={{ scale: 1.08 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setIsOpen(true)}
						className='relative flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-gray-950 font-bold rounded-full shadow-2xl shadow-emerald-500/40 border border-emerald-300/40 cursor-pointer group'
						aria-label='Open AI Assistant'
					>
						<div className='relative flex items-center justify-center'>
							<Sparkles className='w-5 h-5 text-gray-950 animate-spin' style={{ animationDuration: "6s" }} />
							<span className='absolute -top-1 -right-1 flex h-2.5 w-2.5'>
								<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75'></span>
								<span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300'></span>
							</span>
						</div>
						<span className='text-sm font-extrabold tracking-wide hidden sm:inline'>StyleBot AI</span>
					</motion.button>
				)}
			</AnimatePresence>

			{/* Chat Modal Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 40, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 40, scale: 0.9 }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className='w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-gray-900 border border-gray-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl'
					>
						{/* Top Header */}
						<div className='px-5 py-4 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-emerald-500/15 rounded-xl border border-emerald-500/30 text-emerald-400 relative'>
									<Bot className='w-5 h-5' />
									<span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-gray-950' />
								</div>
								<div>
									<div className='flex items-center gap-1.5'>
										<h3 className='font-bold text-white text-base leading-tight'>StyleBot AI</h3>
										<span className='bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/30'>
											Online
										</span>
									</div>
									<p className='text-xs text-gray-400 mt-0.5'>Your Personal Fashion & Shopping Guide</p>
								</div>
							</div>

							<div className='flex items-center gap-1'>
								<button
									onClick={handleClearHistory}
									className='p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer'
									title='Clear Chat History'
								>
									<RotateCcw className='w-4 h-4' />
								</button>
								<button
									onClick={() => setIsOpen(false)}
									className='p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer'
									title='Close Chat'
								>
									<X className='w-5 h-5' />
								</button>
							</div>
						</div>

						{/* Messages Container */}
						<div className='flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700'>
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
								>
									{/* Avatar */}
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
											msg.role === "user"
												? "bg-emerald-600 text-white"
												: "bg-gray-800 border border-gray-700 text-emerald-400"
										}`}
									>
										{msg.role === "user" ? <User className='w-4 h-4' /> : <Bot className='w-4 h-4' />}
									</div>

									{/* Message Body */}
									<div className={`max-w-[80%] space-y-2`}>
										<div
											className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
												msg.role === "user"
													? "bg-emerald-600 text-white rounded-tr-none shadow-md"
													: "bg-gray-800/90 border border-gray-700/70 text-gray-100 rounded-tl-none shadow-md"
											}`}
										>
											<p className='whitespace-pre-wrap'>{msg.content}</p>
										</div>

										{/* Recommended Products Display */}
										{msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
											<div className='space-y-2 pt-1'>
												<span className='text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1'>
													<ShoppingBag className='w-3 h-3' /> Recommended Products
												</span>
												<div className='grid grid-cols-1 gap-2'>
													{msg.recommendedProducts.map((prod) => (
														<Link
															key={prod._id}
															to={`/product/${prod._id}`}
															onClick={() => setIsOpen(false)}
															className='flex items-center gap-3 p-2 bg-gray-950/80 hover:bg-gray-950 border border-gray-700/80 hover:border-emerald-500/60 rounded-xl transition-all duration-200 group'
														>
															<img
																src={prod.image}
																alt={prod.name}
																className='w-12 h-12 object-cover rounded-lg border border-gray-800 shrink-0'
															/>
															<div className='flex-1 min-w-0'>
																<h4 className='text-xs font-bold text-gray-200 group-hover:text-emerald-400 transition-colors truncate'>
																	{prod.name}
																</h4>
																<p className='text-xs text-emerald-400 font-semibold font-mono mt-0.5'>
																	${prod.price?.toFixed(2)}
																</p>
															</div>
															<ChevronRight className='w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5' />
														</Link>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							))}

							{/* Loading Indicator */}
							{loading && (
								<div className='flex gap-3 flex-row items-center'>
									<div className='w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-emerald-400 flex items-center justify-center shrink-0'>
										<Bot className='w-4 h-4' />
									</div>
									<div className='p-3.5 bg-gray-800/90 border border-gray-700/70 rounded-2xl rounded-tl-none flex items-center gap-1.5'>
										<span className='w-2 h-2 bg-emerald-400 rounded-full animate-bounce' style={{ animationDelay: "0ms" }} />
										<span className='w-2 h-2 bg-emerald-400 rounded-full animate-bounce' style={{ animationDelay: "150ms" }} />
										<span className='w-2 h-2 bg-emerald-400 rounded-full animate-bounce' style={{ animationDelay: "300ms" }} />
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Quick Prompt Chips (only if 2 or fewer messages) */}
						{messages.length <= 2 && (
							<div className='px-4 py-2 border-t border-gray-800 bg-gray-950/40 flex flex-wrap gap-1.5'>
								{QUICK_PROMPTS.map((promptText, idx) => (
									<button
										key={idx}
										onClick={() => handleSend(promptText)}
										className='text-[11px] font-medium bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-emerald-300 px-2.5 py-1 rounded-full border border-gray-700 hover:border-emerald-500/40 transition-colors cursor-pointer truncate max-w-full'
									>
										{promptText}
									</button>
								))}
							</div>
						)}

						{/* Input Area */}
						<div className='p-3 bg-gray-950 border-t border-gray-800 flex items-center gap-2'>
							<input
								type='text'
								value={inputPrompt}
								onChange={(e) => setInputPrompt(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSend()}
								placeholder='Ask StyleBot for advice or products...'
								disabled={loading}
								className='flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50'
							/>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => handleSend()}
								disabled={loading || !inputPrompt.trim()}
								className='p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0'
								title='Send Message'
							>
								<Send className='w-4 h-4' />
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default AiChatbot;
