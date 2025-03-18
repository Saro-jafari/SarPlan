'use client';
import Image from 'next/image';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		if (theme === 'system') {
			setTheme('dark');
		}
	}, [theme, setTheme]);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<>
			{isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40" onClick={toggleMenu}></div>}

			<nav className="text-[#000] bg-[#f9f9f9] dark:bg-transparent  dark:text-white px-4 relative z-50">
				<div className="container mx-auto max-w-screen-xl flex justify-between">
					<div className={` flex justify-center ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
						<Link href="https://sarodev.ir">
							<Image
								src={
									theme === 'dark'
										? 'https://saro-resume-2004.storage.c2.liara.space/Logo/Logo.png'
										: 'https://saro-resume-2004.storage.c2.liara.space/Logo/Logo-light.png'
								}
								alt="Sarodev"
								width={150}
								height={150}
							/>
						</Link>
					</div>
					{/* منو دسکتاپ */}
					<ul className="hidden md:flex md:items-center md:justify-center space-x-6">
						<li>
							<Link href="https://sarodev.ir/about" className="hover:text-gray-400">
								درباره ی من
							</Link>
						</li>
						<li>
							<Link href="https://sarodev.ir/contact" className="hover:text-gray-400">
								ارتباط با من
							</Link>
						</li>
						<li className="flex items-center">
							<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-xl cursor-pointer">
								{theme === 'dark' ? <FiSun /> : <FiMoon />}
							</button>
						</li>
					</ul>

					{/* دکمه منو موبایل */}
					<button className="md:hidden relative z-50 text-2xl " onClick={toggleMenu}>
						{isOpen ? <FiX size={40} /> : <FiMenu size={40} />}
					</button>
				</div>

				{/* منوی موبایل */}
				<div
					className={`absolute top-20 left-15 bg-[#1c224c] text-white rounded-lg shadow-lg py-3 w-48 transition-all transform z-50 ${
						isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
					} origin-top-right`}>
					<ul className="flex flex-col space-y-2 text-center">
						<li>
							<Link href="https://sarodev.ir/about" className="block py-2 hover:bg-gray-700 rounded">
								درباره ی من
							</Link>
						</li>
						<li>
							<Link href="https://sarodev.ir/contact" className="block py-2 hover:bg-gray-700 rounded">
								ارتباط با من
							</Link>
						</li>
						<li className="flex justify-center py-2">
							<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-xl">
								{theme === 'dark' ? <FiSun /> : <FiMoon />}
							</button>
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
}
