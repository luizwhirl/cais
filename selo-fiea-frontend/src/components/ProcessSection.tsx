// selo-fiea-frontend/src/components/ProcessSection.tsx

import { Award } from 'lucide-react';

export function ProcessSection() {
  return (
    <section id="processo" className="py-20">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800">Como Funciona o Processo?</h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Desenvolvemos um fluxo simples e transparente para guiar sua empresa rumo à certificação.</p>
            </div>
            <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block"></div>
                <div className="relative md:grid md:grid-cols-2 md:gap-12 items-center mb-12">
                    <div className="md:text-right mb-8 md:mb-0">
                        <div className="bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ml-auto md:ml-auto mr-auto md:mr-0">1</div>
                        <h3 className="text-2xl font-semibold mt-4">Inscrição e Cadastro</h3>
                        <p className="text-gray-600 mt-2">Cadastre sua indústria e os perfis de gestores no nosso portal digital. É o primeiro passo para iniciar a jornada.</p>
                    </div>
                </div>
                <div className="relative md:grid md:grid-cols-2 md:gap-12 items-center mb-12">
                    <div className="hidden md:block"></div>
                    <div className="md:text-left mb-8 md:mb-0">
                        <div className="bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-auto md:mr-auto ml-auto md:ml-0">2</div>
                        <h3 className="text-2xl font-semibold mt-4">Autoavaliação</h3>
                        <p className="text-gray-600 mt-2">Preencha o formulário de autoavaliação, detalhando suas práticas de gestão, sustentabilidade e inovação.</p>
                    </div>
                </div>
                <div className="relative md:grid md:grid-cols-2 md:gap-12 items-center mb-12">
                    <div className="md:text-right mb-8 md:mb-0">
                        <div className="bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ml-auto md:ml-auto mr-auto md:mr-0">3</div>
                        <h3 className="text-2xl font-semibold mt-4">Auditoria Externa</h3>
                        <p className="text-gray-600 mt-2">Receba a visita de um de nossos auditores credenciados para a validação das informações e avaliação in loco.</p>
                    </div>
                </div>
                <div className="relative md:grid md:grid-cols-2 md:gap-12 items-center">
                    <div className="hidden md:block"></div>
                    <div className="md:text-left">
                        <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-auto md:mr-auto ml-auto md:ml-0">
                            <Award />
                        </div>
                        <h3 className="text-2xl font-semibold mt-4">Certificação</h3>
                        <p className="text-gray-600 mt-2">Após a aprovação, sua empresa recebe o Selo FIEA, com validade de um ano, e passa a fazer parte de um seleto grupo de indústrias.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}