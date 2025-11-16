// selo-fiea-frontend/src/components/BenefitsSection.tsx

import { CheckCircle2 } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
      { title: "Reconhecimento de Mercado", description: "Aumente a credibilidade e a confiança de clientes, fornecedores e investidores." },
      { title: "Atração de Investimentos", description: "Empresas certificadas são mais atrativas para investidores que buscam segurança e sustentabilidade." },
      { title: "Eficiência Operacional", description: "O processo de auditoria ajuda a identificar pontos de melhoria e otimizar a operação." },
      { title: "Acesso a Capacitação", description: "Participe de workshops e consultorias exclusivas para manter sua equipe sempre atualizada." },
  ]

  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Vantagens para sua Indústria</h2>
          <p className="text-gray-600 mt-2">Ao obter o Selo FIEA, sua empresa ganha mais do que um certificado.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}