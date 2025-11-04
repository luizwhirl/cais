// src/components/Header.tsx

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; 

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "#processo", label: "Como Funciona" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
           <svg className="h-8 w-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.464 5.464l13.072 13.072m0-13.072L5.464 18.536"/>
            </svg>
          <span className="font-bold text-xl text-gray-800">Selo FIEA</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-600 hover:text-blue-800 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-all shadow-sm">
            Acessar Portal
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden px-6 pb-4 space-y-2`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="block text-gray-600 hover:text-blue-800 transition-colors py-2"
            onClick={() => setIsMenuOpen(false)} 
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}