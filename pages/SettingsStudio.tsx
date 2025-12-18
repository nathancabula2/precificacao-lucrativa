
import React, { useState } from 'react';
import { useStorage } from '../App';

const SettingsStudio: React.FC = () => {
  const { data, updateStudio } = useStorage();
  const [studio, setStudio] = useState(data.studio);
  const [success, setSuccess] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudio(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateStudio(studio);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display text-gray-800">Minha Papelaria</h1>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-pink-50 space-y-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 bg-white rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-pink-200 relative group cursor-pointer shadow-sm">
            {studio.logo ? (
              <img src={studio.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-4xl">📸</span>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
              ALTERAR
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-800">Logo da sua Empresa</h3>
            <p className="text-gray-500 text-sm">Esta imagem aparecerá no topo de todos os seus PDFs de orçamento.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Nome do Ateliê</label>
            <input
              type="text"
              value={studio.name}
              onChange={(e) => setStudio({ ...studio, name: e.target.value })}
              placeholder="Ex: Doce Papel"
              className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">WhatsApp para Contato</label>
            <input
              type="text"
              value={studio.whatsapp}
              onChange={(e) => setStudio({ ...studio, whatsapp: e.target.value })}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-medium"
            />
          </div>
        </div>

        <div className="bg-brand-accent rounded-2xl p-6 space-y-4 border border-pink-100">
          <div className="flex items-center space-x-2 text-brand-primary">
            <span className="text-xl">💰</span>
            <h4 className="font-bold">Dados de Pagamento (PIX)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={studio.pixType}
              onChange={(e: any) => setStudio({ ...studio, pixType: e.target.value })}
              className="px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-bold"
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="E-mail">E-mail</option>
              <option value="Telefone">Telefone</option>
              <option value="Aleatória">Aleatória</option>
            </select>
            <input
              type="text"
              value={studio.pixKey}
              onChange={(e) => setStudio({ ...studio, pixKey: e.target.value })}
              placeholder="Digite a sua chave PIX"
              className="px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-medium"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">Observações padrão (opcional)</label>
          <textarea
            value={studio.notes}
            onChange={(e) => setStudio({ ...studio, notes: e.target.value })}
            placeholder="Ex: Regras de entrega, prazos, etc."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none resize-none bg-white text-gray-900 font-medium"
          ></textarea>
        </div>

        <div className="flex flex-col items-center pt-4">
          <button
            onClick={handleSave}
            className="w-full md:w-auto px-12 py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg hover:bg-brand-secondary transition-all active:scale-95"
          >
            Salvar Identidade do Ateliê
          </button>
          {success && <p className="mt-3 text-green-500 font-bold animate-pulse">Salvo com sucesso! ✨</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsStudio;
