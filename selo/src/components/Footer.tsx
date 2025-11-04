// selo-fiea-frontend/src/components/Footer.tsx

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Selo FIEA de Excelência e Inovação</h3>
            <p className="text-gray-400">Um projeto da Federação das Indústrias do Estado de Alagoas em parceria com a BRISA para fortalecer o parque industrial alagoano.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#sobre" className="text-gray-400 hover:text-white">Sobre o Selo</a></li>
              <li><a href="#beneficios" className="text-gray-400 hover:text-white">Benefícios</a></li>
              <li><a href="#processo" className="text-gray-400 hover:text-white">Processo de Certificação</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <p className="text-gray-400">odilon.nascimento@brisabr.com.br</p>
            <p className="text-gray-400">Av. Fernandes Lima, 385 - Farol, Maceió - AL</p>
            <div className="flex space-x-4 mt-4">
              <p className="text-gray-400 font-semibold">Parceiros:</p>
              <span className="font-bold">FIEA</span>
              <span className="font-bold">BRISA</span>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>&copy; 2024 Selo FIEA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}