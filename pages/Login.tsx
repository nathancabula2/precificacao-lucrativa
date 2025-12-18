
import React, { useState } from 'react';
import { useStorage } from '../App';

const Login: React.FC = () => {
  const { login } = useStorage();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais atualizadas conforme solicitação
    if (user.toUpperCase() === 'ALUNA' && password.toUpperCase() === 'PAPELARIA123') {
      login();
    } else {
      setError('Credenciais incorretas. Verifique o usuário e senha.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-xl p-10 flex flex-col items-center border border-pink-100">
        <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center text-white text-4xl mb-6 shadow-lg rotate-3">
          ✨
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 font-display mb-2 text-center">Precificação Lucrativa</h1>
        <p className="text-brand-secondary font-medium mb-8 text-center">Acesso exclusivo para alunas</p>
        
        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Usuário</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Digite ALUNA"
              className="w-full px-5 py-4 rounded-2xl border-2 border-pink-50 focus:border-brand-primary focus:outline-none transition-all placeholder:text-gray-300 bg-white text-gray-900 font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite PAPELARIA123"
              className="w-full px-5 py-4 rounded-2xl border-2 border-pink-50 focus:border-brand-primary focus:outline-none transition-all placeholder:text-gray-300 bg-white text-gray-900 font-medium"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center font-medium animate-shake">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-brand-secondary hover:-translate-y-1 transition-all active:scale-95 mt-4"
          >
            Entrar no App
          </button>
        </form>
        
        <footer className="mt-10 text-center text-gray-400 text-sm px-4">
          Acesso simples. Seus dados ficam salvos apenas neste dispositivo localmente.
        </footer>
      </div>
    </div>
  );
};

export default Login;
