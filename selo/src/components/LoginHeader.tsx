// src/components/LoginHeader.tsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.25v11.5" />
            <path d="M3 12h18" />
            <path d="M5.46 5.46l13.08 13.08" />
            <path d="M18.54 5.46L5.46 18.54" />
          </svg>
          <span className="font-bold text-xl text-gray-800">Selo FIEA</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="border border-blue-700 text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 hover:text-white transition-all shadow-sm">
            Voltar ao Início
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden px-6 pb-4 space-y-2`}>
        <Link to="/" className="block text-gray-600 hover:text-blue-800 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
          Voltar ao Início
        </Link>
      </div>
    </header>
  );
}