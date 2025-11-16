// selo-fiea-frontend/src/components/AboutSection.tsx

import { Award, Leaf, Cpu } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="sobre" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">O que é o Selo FIEA?</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Uma certificação criada pela Federação das Indústrias do Estado de Alagoas para destacar empresas que são referência em gestão moderna e práticas inovadoras.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="text-blue-700 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
            <p className="text-gray-600">Reconhecimento de excelência em práticas de gestão, eficiência operacional e conformidade com os mais altos padrões de qualidade.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-green-700 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustentabilidade</h3>
            <p className="text-gray-600">Destaque para indústrias com forte compromisso ambiental, adotando tecnologias verdes e gestão eficiente de recursos.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Cpu className="text-purple-700 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inovação</h3>
            <p className="text-gray-600">Valorização da adaptação a tecnologias emergentes, automação de processos e transformação digital no ambiente industrial.</p>
          </div>
        </div>
      </div>
    </section>
  );
}