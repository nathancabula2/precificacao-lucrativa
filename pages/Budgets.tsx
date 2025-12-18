
import React, { useState } from 'react';
import { useStorage } from '../App';
import { Budget, BudgetItem } from '../types';
import { generateBudgetPDF } from '../utils/pdfGenerator';

const Budgets: React.FC = () => {
  const { data, setBudgets } = useStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  
  // Estado para o pop-up de confirmação de exclusão
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  // New Budget Form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedItems, setSelectedItems] = useState<BudgetItem[]>([]);

  const resetForm = () => {
    setClientName('');
    setClientPhone('');
    setSelectedItems([]);
    setIsProductMenuOpen(false);
  };

  const addItem = (productId: string) => {
    const prod = data.products.find(p => p.id === productId);
    if (!prod) return;
    
    const newItem: BudgetItem = {
      productId: prod.id,
      nameSnapshot: prod.name,
      lineSnapshot: prod.line,
      descriptionSnapshot: prod.observations,
      unitPriceSnapshot: prod.salePrice,
      quantity: 1,
      totalItem: prod.salePrice
    };
    setSelectedItems([...selectedItems, newItem]);
    setIsProductMenuOpen(false);
  };

  const removeItem = (idx: number) => {
    if (window.confirm('Deseja realmente remover este item do orçamento?')) {
      setSelectedItems(selectedItems.filter((_, i) => i !== idx));
    }
  };

  const updateItemQty = (idx: number, qty: number) => {
    const list = [...selectedItems];
    list[idx].quantity = qty;
    list[idx].totalItem = list[idx].unitPriceSnapshot * qty;
    setSelectedItems(list);
  };

  const totalGeneral = selectedItems.reduce((sum, item) => sum + item.totalItem, 0);

  const handleSaveBudget = () => {
    if (!clientName || selectedItems.length === 0) return;
    
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      clientName,
      clientPhone,
      items: selectedItems,
      totalGeneral,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setBudgets([newBudget, ...data.budgets]);
    setIsModalOpen(false);
    resetForm();
  };

  const confirmDeleteBudget = () => {
    if (budgetToDelete) {
      setBudgets(data.budgets.filter(b => b.id !== budgetToDelete));
      setBudgetToDelete(null);
    }
  };

  const handleShareWhatsApp = (budget: Budget) => {
    const message = `Olá! Segue o orçamento do ateliê ${data.studio.name || 'Personalizado'}:\n\n` +
      budget.items.map(i => `• ${i.nameSnapshot} (${i.lineSnapshot}) - ${i.quantity} un: R$ ${i.totalItem.toFixed(2)}`).join('\n') +
      `\n\nTotal Geral: R$ ${budget.totalGeneral.toFixed(2)}`;
    
    const encoded = encodeURIComponent(message);
    const url = budget.clientPhone 
      ? `https://wa.me/55${budget.clientPhone.replace(/\D/g, '')}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-800">Meus Orçamentos</h1>
          <p className="text-gray-500">Transforme rascunhos em vendas reais.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-brand-secondary transition-all"
        >
          + Novo Orçamento
        </button>
      </div>

      <div className="space-y-6">
        {data.budgets.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-pink-100 text-gray-400">
            Ainda não há orçamentos salvos.
          </div>
        ) : (
          data.budgets.map(budget => (
            <div key={budget.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-50 pb-6 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{budget.clientName}</h3>
                  <p className="text-sm text-gray-400">
                    Criado em: {new Date(budget.createdAt).toLocaleDateString('pt-BR')} {budget.clientPhone && ` • ${budget.clientPhone}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleShareWhatsApp(budget)}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => generateBudgetPDF(budget, data.studio)}
                    className="flex items-center space-x-2 bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-secondary transition-colors"
                  >
                    <span>📄</span>
                    <span>Gerar PDF</span>
                  </button>
                  <button 
                    onClick={() => setBudgetToDelete(budget.id)} 
                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                    title="Excluir Orçamento"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {budget.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <p className="font-bold text-gray-700">{item.nameSnapshot}</p>
                      <p className="text-xs text-gray-400">{item.lineSnapshot} • {item.quantity} un</p>
                    </div>
                    <p className="font-bold text-gray-800">R$ {item.totalItem.toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-pink-50 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-500 uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-black text-brand-primary">R$ {budget.totalGeneral.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Novo Orçamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-brand-primary p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-display">Criar Orçamento Profissional</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nome da Cliente</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Telefone (opcional)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Whatsapp do Cliente (XX) XXXXX-XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase">Itens do Orçamento</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                      className="bg-brand-secondary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-brand-primary transition-all"
                    >
                      + Adicionar Produto
                    </button>
                    {isProductMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-2xl rounded-2xl border border-pink-100 z-[120] p-4 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-pink-50">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Selecione no catálogo</span>
                          <button onClick={() => setIsProductMenuOpen(false)} className="text-gray-400">&times;</button>
                        </div>
                        {data.products.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center">Nenhum produto no catálogo.</p>
                        ) : (
                          <div className="space-y-1">
                            {data.products.map(p => (
                              <button
                                key={p.id}
                                onClick={() => addItem(p.id)}
                                className="w-full text-left p-2 hover:bg-pink-50 rounded-lg text-sm text-gray-700 font-medium transition-colors border border-transparent hover:border-pink-200"
                              >
                                {p.name} <span className="text-xs text-brand-primary block">R$ {p.salePrice.toFixed(2)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-brand-accent rounded-2xl border border-pink-100">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{item.nameSnapshot}</p>
                        <p className="text-xs text-brand-primary">Unitário: R$ {item.unitPriceSnapshot.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] font-bold text-gray-400">QTD</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                            className="w-12 px-1 py-1 rounded-lg border-none text-center font-bold bg-white text-gray-900 shadow-sm"
                          />
                        </div>
                        <p className="w-20 text-right font-bold text-gray-700">R$ {item.totalItem.toFixed(2)}</p>
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">🗑️</button>
                      </div>
                    </div>
                  ))}
                  {selectedItems.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-pink-100 rounded-[32px] text-gray-400 text-sm">
                      Selecione produtos para compor o orçamento.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-pink-50 flex justify-between items-center">
                <div className="text-lg font-bold text-gray-800">
                  Total Geral: <span className="text-brand-primary">R$ {totalGeneral.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleSaveBudget}
                  disabled={!clientName || selectedItems.length === 0}
                  className="bg-brand-primary text-white font-bold px-12 py-3 rounded-2xl shadow-xl hover:bg-brand-secondary transition-all disabled:opacity-50"
                >
                  Salvar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up de Confirmação de Exclusão de Orçamento */}
      {budgetToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center space-y-6 transform transition-all animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
              📝
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">Excluir orçamento?</h3>
              <p className="text-gray-500 text-sm">Deseja realmente excluir este item? Esta ação removerá o orçamento permanentemente.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={confirmDeleteBudget}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-colors shadow-md"
              >
                Sim, excluir
              </button>
              <button 
                onClick={() => setBudgetToDelete(null)}
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

export default Budgets;
