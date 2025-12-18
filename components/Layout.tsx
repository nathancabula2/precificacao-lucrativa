
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStorage } from '../App';
import HelpModal from './HelpModal';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, logout } = useStorage();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const menuItems = [
    { label: 'Painel', path: '/painel', icon: '📊' },
    { 
      label: 'Configurações Iniciais', 
      subItems: [
        { label: 'Minha Papelaria', path: '/config/estudio' },
        { label: 'Mão de Obra/Margem', path: '/config/mao-de-obra' }
      ]
    },
    { 
      label: 'Materiais e Insumos', 
      subItems: [
        { label: 'Cadastrar Materiais', path: '/materiais' }
      ]
    },
    { 
      label: 'Produto', 
      subItems: [
        { label: 'Cadastrar Produto', path: '/produto/novo' },
        { label: 'Produtos Criados', path: '/produtos' }
      ]
    },
    { label: 'Orçamentos', path: '/orcamentos', icon: '📝' },
    { label: 'Ajuda', path: '/ajuda', icon: '❓' },
  ];

  const getRouteKey = () => {
    if (location.pathname === '/painel') return 'dashboard';
    if (location.pathname === '/config/estudio') return 'settings_studio';
    if (location.pathname === '/config/mao-de-obra') return 'settings_labor';
    if (location.pathname === '/materiais') return 'materials';
    if (location.pathname.startsWith('/produto/novo')) return 'product_wizard';
    if (location.pathname === '/produtos') return 'product_list';
    if (location.pathname === '/orcamentos') return 'budgets';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen bg-brand-light overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-pink-100 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-pink-50">
          <h1 className="text-xl font-bold text-brand-primary font-display leading-tight">Precificação<br/>Lucrativa</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path ? 'bg-brand-primary text-white shadow-md' : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <div className="pt-4 pb-1">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <div className="mt-1 space-y-1">
                    {item.subItems?.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={sub.path}
                        className={`block p-3 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === sub.path ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-600 hover:bg-pink-50'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-pink-50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <span>🚪</span>
            <span className="font-medium">Sair do App</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-pink-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
              {menuItems.find(i => i.path === location.pathname)?.label || "Ateliê"}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
             <button
              onClick={() => setIsHelpOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-accent text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm"
              title="Ajuda desta tela"
            >
              <span className="text-xl font-bold">?</span>
            </button>
            <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {data.studio.name ? data.studio.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>

        {/* Floating Mobile Help (Simple) */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
        >
          ?
        </button>
      </main>

      {isHelpOpen && (
        <HelpModal 
          routeKey={getRouteKey()} 
          onClose={() => setIsHelpOpen(false)} 
        />
      )}
    </div>
  );
};

export default Layout;
