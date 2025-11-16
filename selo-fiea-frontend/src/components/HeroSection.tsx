// selo-fiea-frontend/src/components/HeroSection.tsx

import { Link } from "react-router-dom"; 

export function HeroSection() {
  return (
    <section className="hero-bg py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 leading-tight mb-4">Selo FIEA de Excelência e Inovação</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">O reconhecimento que sua indústria merece por suas práticas em qualidade, sustentabilidade e tecnologia.</p>
        
        <Link 
          to="/register" 
          className="bg-green-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-green-700 transition-all shadow-lg transform hover:scale-105"
        >
          Inscreva sua Indústria Agora
        </Link>
      </div>
    </section>
  );
}