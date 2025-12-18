
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../App';

const ProductList: React.FC = () => {
  const { data, setProducts } = useStorage();
  const navigate = useNavigate();
  
  // Estado para controlar qual produto está sendo excluído e abrir o modal
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(data.products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-800">Catálogo de Produtos</h1>
          <p className="text-gray-500">Seus mimos precificados com perfeição.</p>
        </div>
        <button
          onClick={() => navigate('/produto/novo')}
          className="bg-brand-primary text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-brand-secondary transition-all"
        >
          + Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.products.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-pink-100 text-gray-400">
            Você ainda não tem produtos no catálogo.
          </div>
        ) : (
          data.products.map(p => (
            <div key={p.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-pink-50 group hover:shadow-xl transition-all">
              <div className="p-1 bg-brand-primary"></div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                      p.line === 'LUXO' ? 'bg-yellow-100 text-yellow-700' : p.line === 'CLÁSSICA' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {p.line}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mt-2">{p.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      type="button"
                      onClick={() => navigate(`/produto/novo/${p.id}`)} 
                      className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProductToDelete(p.id)} 
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 h-10">{p.observations}</p>

                <div className="flex items-end justify-between pt-4 border-t border-pink-50">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Preço de Venda</p>
                    <p className="text-2xl font-black text-brand-primary">R$ {p.salePrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Lucro</p>
                    <p className="text-lg font-bold text-green-500">R$ {p.netProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pop-up de Confirmação de Exclusão de Produto */}
      {productToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center space-y-6 transform transition-all animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
              📦
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">Excluir produto?</h3>
              <p className="text-gray-500 text-sm">Deseja realmente excluir este produto do catálogo? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={confirmDelete}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-colors shadow-md"
              >
                Sim, excluir
              </button>
              <button 
                onClick={() => setProductToDelete(null)}
                className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
