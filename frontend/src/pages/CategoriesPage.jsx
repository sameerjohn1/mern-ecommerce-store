import { motion } from "framer-motion";
import CategoryItem from "../components/CategoryItem";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const CategoriesPage = () => {
	return (
		<div className="relative min-h-screen text-white overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-12"
				>
					<h1 className="text-5xl sm:text-6xl font-bold text-emerald-400 mb-4 tracking-tight">
						Explore Our Categories
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Discover the latest trends in eco-friendly fashion and find the perfect fit for your style.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default CategoriesPage;
