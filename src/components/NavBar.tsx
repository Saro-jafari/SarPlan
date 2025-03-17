'use client';
import { useState } from "react";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto max-w-screen-xl flex justify-between items-center">
        {/* Logo */}
        <Image
          src="https://saro-resume-2004.storage.c2.liara.space/Logo/logo.webp"
          alt="Sarodev"
          width={80}
          height={80}
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="#" className="hover:text-gray-400">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Contact
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-2 mt-4 text-center">
          <li>
            <a href="#" className="block py-2 hover:bg-gray-700">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 hover:bg-gray-700">
              About
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 hover:bg-gray-700">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 hover:bg-gray-700">
              Contact
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}