// selo-fiea-frontend/src/components/ContactSection.tsx

export function ContactSection() {
  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Fale Conosco</h2>
          <p className="text-gray-600 mt-2">Tem alguma dúvida? Nossa equipe está pronta para ajudar.</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <form>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Nome Completo" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Seu E-mail</label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="email@empresa.com.br" />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Nome da Indústria</label>
              <input type="text" id="company" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Nome da sua empresa" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Escreva sua dúvida aqui..."></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all">Enviar Mensagem</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}