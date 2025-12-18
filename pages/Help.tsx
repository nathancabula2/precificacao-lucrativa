
import React, { useState } from 'react';

const Help: React.FC = () => {
  const faqs = [
    { 
      q: 'Como é calculado o custo do meu tempo?', 
      a: 'O sistema usa a fórmula: Salário Desejado / (Dias trabalhados x Horas por dia x 60 minutos). Assim chegamos ao valor exato de quanto vale cada minuto do seu trabalho.'
    },
    { 
      q: 'O que são os insumos?', 
      a: 'São todos os materiais que você compra. Você pode cadastrar como pacote (ex: Pacote de Papel com 50 folhas) e o sistema calculará o valor de uma única unidade para facilitar seu cálculo de custo do produto.'
    },
    { 
      q: 'Como enviar o orçamento para a cliente?', 
      a: 'Na tela de Orçamentos, você tem o botão de WhatsApp que envia um texto resumido, e o botão PDF que gera um arquivo lindo e profissional com a sua logo para você enviar o arquivo.'
    },
    { 
      q: 'Meus dados estão seguros?', 
      a: 'Sim! Seus dados são salvos apenas no navegador deste dispositivo (computador ou celular). Nós não temos acesso e eles não ficam na nuvem.'
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-display text-gray-800">Central de Ajuda</h1>
        <p className="text-lg text-gray-500 font-medium">Estamos aqui para ajudar você a lucrar mais!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-pink-50 space-y-6">
          <div className="flex items-center space-x-3 text-brand-primary">
            <span className="text-3xl">❓</span>
            <h3 className="text-xl font-bold">Dúvidas Frequentes</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border border-pink-50 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-4 bg-brand-accent font-bold text-gray-700 flex justify-between items-center"
                >
                  <span>{f.q}</span>
                  <span className="text-brand-primary">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-brand-primary p-8 rounded-[40px] text-white shadow-xl space-y-4">
            <h3 className="text-2xl font-bold">Precisa de suporte?</h3>
            <p className="text-pink-100 font-medium">Nossa equipe está pronta para ajudar você com qualquer dúvida técnica sobre o app.</p>
            <a
              href="https://wa.me/5500000000000?text=Olá,%20estou%20com%20uma%20dúvida%20no%20App%20Precificação%20Lucrativa."
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full text-center bg-white text-brand-primary font-bold py-4 rounded-2xl hover:bg-brand-accent transition-all shadow-lg"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-pink-50 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Links Úteis</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-brand-primary font-medium hover:underline flex items-center">✨ Tutorial Completo em Vídeo</a></li>
              <li><a href="#" className="text-brand-primary font-medium hover:underline flex items-center">📄 Planilha Auxiliar de Brinde</a></li>
              <li><a href="#" className="text-brand-primary font-medium hover:underline flex items-center">⭐ Grupo de Alunas no Facebook</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
