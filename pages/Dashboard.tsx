
import React from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../App';

const Dashboard: React.FC = () => {
  const { data } = useStorage();

  const stats = [
    { label: 'Produtos salvos', value: data.products.length, icon: '📦', color: 'bg-blue-50 text-blue-500' },
    { label: 'Orçamentos gerados', value: data.budgets.length, icon: '📄', color: 'bg-green-50 text-green-500' },
    { label: 'Materiais cadastrados', value: data.materials.length, icon: '✂️', color: 'bg-purple-50 text-purple-500' },
  ];

  const shortcuts = [
    { title: 'Cadastrar Materiais', desc: 'Gerencie seus insumos', to: '/materiais', icon: '💎' },
    { title: 'Criar Produtos', desc: 'Defina custos e lucros', to: '/produto/novo', icon: '🎨' },
    { title: 'Novo Orçamento', desc: 'Envie para sua cliente', to: '/orcamentos', icon: '💸' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      {/* Banner */}
      <div className="bg-brand-primary rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">Olá, Empreendedora! ✨</h1>
          <p className="text-pink-100 text-lg md:text-xl font-medium max-w-lg">
            Vamos organizar seu ateliê e lucrar mais hoje? Seus números estão esperando.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-pink-50 flex items-center space-x-4">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 font-display flex items-center space-x-2">
          <span>🚀</span>
          <span>Acesso Rápido</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shortcuts.map((sc, idx) => (
            <Link
              key={idx}
              to={sc.to}
              className="group bg-white p-8 rounded-[32px] border border-pink-50 shadow-sm hover:shadow-md hover:border-brand-primary transition-all flex flex-col items-start"
            >
              <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {sc.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">{sc.title}</h4>
              <p className="text-gray-500 text-sm">{sc.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
