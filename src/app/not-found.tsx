'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-[#14162E] text-white overflow-hidden cursor-pointer">
			<div className="relative flex items-center">
				<motion.span
					className="text-[8rem] md:text-[12rem] font-bold text-[#677185] drop-shadow-lg rotate-[-20deg]"
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}>
					4
				</motion.span>
				<motion.span
					className="text-[8rem] md:text-[12rem] font-bold text-[#fff] drop-shadow-lg"
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					0
				</motion.span>
				<motion.span
					className="text-[8rem] md:text-[12rem] font-bold text-[#677185] drop-shadow-lg rotate-[20deg]"
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					4
				</motion.span>
			</div>
			<motion.p
				className="text-lg md:text-2xl mt-4 text-gray-300"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.6 }}>
				صفحه‌ای که دنبالش هستی وجود نداره!
			</motion.p>
			<motion.button
				onClick={() => router.push('/')}
				className="mt-6 px-6 py-3 bg-[#677185] text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-[#fff] hover:text-[#14162E] transition-all duration-300 cursor-pointer"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.8 }}>
				بازگشت به صفحه اصلی
			</motion.button>
		</div>
	);
}
