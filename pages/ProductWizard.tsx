
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStorage } from '../App';
import { Product, ProductLine, ProductStatus, ProductMaterial } from '../types';

const ProductWizard: React.FC = () => {
  const { data, setProducts } = useStorage();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [step, setStep] = useState(0);
  const [isMaterialMenuOpen, setIsMaterialMenuOpen] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    id: id || crypto.randomUUID(),
    category: 'Caixinhas',
    line: 'BÁSICA',
    assemblyMinutes: 5,
    printingSheets: 1,
    materials: [],
    marginPercent: data.labor.defaultMargin
  });

  // Estado para o pop-up de confirmação de exclusão de material na lista
  const [materialIdxToRemove, setMaterialIdxToRemove] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const existing = data.products.find(p => p.id === id);
      if (existing) setProduct(existing);
    }
  }, [id, data.products]);

  const getAutoDescription = (cat: ProductStatus, line: ProductLine) => {
    if (line === 'BÁSICA') {
      return `${cat === 'Caixinhas' ? 'Caixinha' : 'Lembrancinha'} Personalizada com impressão alta qualidade, corte e montagem completa.`;
    }
    if (line === 'CLÁSSICA') {
      return `${cat} Personalizada com impressão alta qualidade. Acompanha: Laço e apliques 3D.`;
    }
    return `${cat} Personalizada com impressão alta qualidade e acabamentos Luxo. Acompanha: Laço, apliques 3D, pedrarias e/ou aviamentos.`;
  };

  const handleLineSelect = (line: ProductLine) => {
    const desc = getAutoDescription(product.category as ProductStatus, line);
    setProduct(prev => ({ ...prev, line, observations: desc }));
  };

  const addMaterial = (materialId: string) => {
    const m = data.materials.find(x => x.id === materialId);
    if (!m) return;
    const newItem: ProductMaterial = {
      materialId: m.id,
      nameSnapshot: m.name,
      unitCostSnapshot: m.unitCost,
      quantity: 1
    };
    setProduct(prev => ({
      ...prev,
      materials: [...(prev.materials || []), newItem]
    }));
    setIsMaterialMenuOpen(false);
  };

  const confirmRemoveMaterial = () => {
    if (materialIdxToRemove !== null) {
      setProduct(prev => ({
        ...prev,
        materials: (prev.materials || []).filter((_, i) => i !== materialIdxToRemove)
      }));
      setMaterialIdxToRemove(null);
    }
  };

  const updateMaterialQty = (idx: number, qty: number) => {
    setProduct(prev => {
      const list = [...(prev.materials || [])];
      list[idx].quantity = qty;
      return { ...prev, materials: list };
    });
  };

  const calcMaterialsTotal = () => {
    return (product.materials || []).reduce((sum, item) => sum + (item.unitCostSnapshot * item.quantity), 0);
  };

  const calcLaborTotal = () => {
    return (product.assemblyMinutes || 0) * data.labor.costPerMinute;
  };

  const calcPrintingTotal = () => {
    return (product.printingSheets || 0) * data.labor.printingCostPerSheet;
  };

  const costTotal = calcMaterialsTotal() + calcLaborTotal() + calcPrintingTotal();
  const salePrice = costTotal * (1 + (product.marginPercent || 0) / 100);
  const netProfit = salePrice - costTotal;

  const handleFinish = () => {
    const finalProduct: Product = {
      ...(product as Product),
      costMaterials: calcMaterialsTotal(),
      costLabor: calcLaborTotal(),
      costPrinting: calcPrintingTotal(),
      costTotal: costTotal,
      salePrice: salePrice,
      netProfit: netProfit,
      createdAt: product.createdAt || Date.now(),
      updatedAt: Date.now()
    } as Product;

    if (id) {
      setProducts(data.products.map(p => p.id === id ? finalProduct : p));
    } else {
      setProducts([...data.products, finalProduct]);
    }
    navigate('/produtos');
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-10">
        {[0, 1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-pink-100 text-pink-300'
            }`}>
              {s + 1}
            </div>
            <div className="h-1 w-full mt-3 bg-pink-100 relative">
               {step > s && <div className="absolute inset-0 bg-brand-primary animate-in slide-in-from-left duration-300"></div>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-pink-50 animate-in fade-in zoom-in-95 duration-300">
        {step === 0 && (
          <div className="p-10 text-center space-y-10">
            <h2 className="text-3xl font-bold font-display text-gray-800">Novo Produto no Catálogo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => { setProduct(prev => ({ ...prev, category: 'Caixinhas' })); setStep(1); }}
                className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center space-y-4 ${
                  product.category === 'Caixinhas' ? 'border-brand-primary bg-brand-accent' : 'border-pink-50 hover:border-brand-secondary'
                }`}
              >
                <span className="text-6xl">📦</span>
                <span className="text-xl font-bold text-gray-800">Caixinhas</span>
                <span className="text-sm text-gray-500">(Milk, Pirâmide, Sushi...)</span>
              </button>
              <button
                onClick={() => { setProduct(prev => ({ ...prev, category: 'Lembrancinhas' })); setStep(1); }}
                className={`p-10 rounded-[40px] border-4 transition-all flex flex-col items-center space-y-4 ${
                  product.category === 'Lembrancinhas' ? 'border-brand-primary bg-brand-accent' : 'border-pink-50 hover:border-brand-secondary'
                }`}
              >
                <span className="text-6xl">🎁</span>
                <span className="text-xl font-bold text-gray-800">Lembrancinhas</span>
                <span className="text-sm text-gray-500">(Agenda, Kit, Mimos...)</span>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="p-10 space-y-8">
            <h2 className="text-2xl font-bold font-display text-gray-800">Informações Básicas</h2>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Nome do Produto</label>
              <input
                type="text"
                value={product.name || ''}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Ex: Caixinha Milk Ursinho"
                className="w-full px-5 py-4 rounded-2xl border-2 border-pink-50 focus:border-brand-primary outline-none text-lg bg-white text-gray-900 font-medium"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-600">Escolha a Linha</label>
              <div className="grid grid-cols-3 gap-4">
                {(['BÁSICA', 'CLÁSSICA', 'LUXO'] as ProductLine[]).map(l => (
                  <button
                    key={l}
                    onClick={() => handleLineSelect(l)}
                    className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                      product.line === l ? 'bg-brand-primary border-brand-primary text-white shadow-md' : 'border-pink-50 text-gray-400 hover:border-brand-secondary'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Observações do Produto</label>
              <textarea
                value={product.observations || ''}
                onChange={(e) => setProduct({ ...product, observations: e.target.value })}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl border-2 border-pink-50 focus:border-brand-primary outline-none resize-none bg-white text-gray-900 font-medium"
              ></textarea>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(0)} className="px-8 py-3 text-brand-primary font-bold">Voltar</button>
              <button 
                onClick={() => setStep(2)} 
                disabled={!product.name}
                className="bg-brand-primary text-white font-bold px-12 py-3 rounded-2xl shadow-lg disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 space-y-8">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-display text-gray-800">Custos de Produção</h2>
                <div className="bg-brand-accent px-4 py-2 rounded-xl text-brand-primary font-bold text-sm">
                  Custo Atual: R$ {costTotal.toFixed(2)}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-6 bg-brand-accent rounded-3xl border border-pink-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-brand-primary uppercase tracking-wider">Tempo de Montagem (minutos)</label>
                    <span className="text-xs text-brand-secondary font-medium italic">Recomendado: 5-10 minutos</span>
                  </div>
                  <input
                    type="number"
                    value={product.assemblyMinutes}
                    onChange={(e) => setProduct({ ...product, assemblyMinutes: Number(e.target.value) })}
                    className="w-full px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none bg-white font-bold text-gray-900 shadow-sm"
                  />
                </div>

                <div className="space-y-4 p-6 bg-brand-accent rounded-3xl border border-pink-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-brand-primary uppercase tracking-wider">Folhas de Impressão</label>
                    <span className="text-xs text-brand-secondary font-medium italic">Unitário: R$ {data.labor.printingCostPerSheet.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={product.printingSheets}
                    onChange={(e) => setProduct({ ...product, printingSheets: Number(e.target.value) })}
                    className="w-full px-5 py-3 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary outline-none bg-white font-bold text-gray-900 shadow-sm"
                  />
                  <p className="text-[10px] text-gray-400 font-medium italic mt-1">
                    Custo de impressão definido na aba Mão de Obra/Margem
                  </p>
                </div>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-600">Lista de Materiais</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsMaterialMenuOpen(!isMaterialMenuOpen)}
                    className="bg-brand-secondary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-primary transition-all"
                  >
                    + Adicionar Material
                  </button>
                  {isMaterialMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-2xl rounded-2xl border border-pink-100 z-[60] p-4 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-pink-50">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Selecione um item</span>
                        <button type="button" onClick={() => setIsMaterialMenuOpen(false)} className="text-gray-400">&times;</button>
                      </div>
                      {data.materials.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center">Nenhum material cadastrado.</p>
                      ) : (
                        <div className="space-y-1">
                          {data.materials.map(m => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => addMaterial(m.id)}
                              className="w-full text-left p-2 hover:bg-pink-50 rounded-lg text-sm text-gray-700 font-medium transition-colors border border-transparent hover:border-pink-200"
                            >
                              {m.name} <span className="text-xs text-brand-primary block">R$ {m.unitCost.toFixed(2)} / {m.unit}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
               </div>
               <div className="space-y-3">
                 {product.materials?.map((m, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-white border border-pink-100 rounded-2xl shadow-sm">
                     <div className="flex-1">
                        <p className="font-bold text-gray-800">{m.nameSnapshot}</p>
                        <p className="text-xs text-gray-400">R$ {m.unitCostSnapshot.toFixed(2)} un</p>
                     </div>
                     <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          step="0.01"
                          value={m.quantity}
                          onChange={(e) => updateMaterialQty(idx, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-pink-100 rounded-lg text-center font-bold text-brand-primary bg-white text-gray-900"
                        />
                        <p className="w-20 text-right font-bold text-gray-700">R$ {(m.unitCostSnapshot * m.quantity).toFixed(2)}</p>
                        <button 
                          type="button"
                          onClick={() => setMaterialIdxToRemove(idx)} 
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Remover"
                        >
                          🗑️
                        </button>
                     </div>
                   </div>
                 ))}
                 {product.materials?.length === 0 && (
                   <div className="text-center py-10 border-2 border-dashed border-pink-100 rounded-[32px] text-gray-400 text-sm">
                     Clique em "Adicionar Material" para listar os insumos deste produto.
                   </div>
                 )}
               </div>
             </div>
             <div className="flex justify-between pt-4">
              <button type="button" onClick={() => setStep(1)} className="px-8 py-3 text-brand-primary font-bold">Voltar</button>
              <button type="button" onClick={() => setStep(3)} className="bg-brand-primary text-white font-bold px-12 py-3 rounded-2xl shadow-lg">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 space-y-8">
             <h2 className="text-2xl font-bold font-display text-gray-800 text-center">Preço Sugerido de Venda</h2>
             <div className="flex flex-col items-center justify-center p-10 bg-brand-accent rounded-[40px] border-2 border-brand-primary/20 space-y-4">
                <p className="text-gray-500 font-medium">Preço de Venda Unitário</p>
                <p className="text-6xl font-black text-brand-primary">
                  R$ {salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex space-x-4 mt-4">
                  <div className="bg-white px-6 py-3 rounded-2xl shadow-sm text-center border border-pink-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Margem</p>
                    <p className="text-lg font-bold text-brand-secondary">{product.marginPercent}%</p>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-2xl shadow-sm text-center border border-pink-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Lucro Líquido</p>
                    <p className="text-lg font-bold text-green-500">R$ {netProfit.toFixed(2)}</p>
                  </div>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-pink-100 rounded-3xl">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 border-b border-pink-50 pb-2 mb-4">Detalhamento de Custos</h4>
                  
                  {/* Materiais Individuais */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {product.materials?.length === 0 ? (
                      <div className="flex justify-between text-sm text-gray-700">
                        <span className="italic">Nenhum material</span>
                        <span className="font-semibold text-gray-900">R$ 0,00</span>
                      </div>
                    ) : (
                      product.materials?.map((m, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-700 items-baseline gap-2">
                          <span className="truncate">{m.nameSnapshot} (x{m.quantity})</span>
                          <span className="font-semibold text-gray-900 whitespace-nowrap">R$ {(m.unitCostSnapshot * m.quantity).toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex justify-between text-sm text-gray-700 pt-3 border-t border-pink-50">
                    <span>Mão de obra ({product.assemblyMinutes} min):</span>
                    <span className="font-semibold text-gray-900">R$ {calcLaborTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 pb-2">
                    <span>Impressão ({product.printingSheets} fls):</span>
                    <span className="font-semibold text-gray-900">R$ {calcPrintingTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg pt-4 border-t-2 border-brand-primary/10 font-bold text-brand-primary">
                    <span>Custo Total:</span>
                    <span>R$ {costTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-800 border-b border-pink-50 pb-2">Ajustar Lucro</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-gray-400">DEFINIR MARGEM</span>
                      <span className="text-sm font-black text-brand-primary bg-brand-accent px-2 py-1 rounded-lg">+{product.marginPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={product.marginPercent}
                      onChange={(e) => setProduct({ ...product, marginPercent: Number(e.target.value) })}
                      className="w-full accent-brand-primary"
                    />
                    <div className="bg-brand-accent p-3 rounded-xl border border-pink-100">
                       <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">Impacto no Preço</p>
                       <p className="text-xs text-gray-600">Com <span className="font-bold">{product.marginPercent}%</span> de margem, cada unidade será vendida por <span className="font-bold">R$ {salePrice.toFixed(2)}</span> gerando <span className="font-bold text-green-600">R$ {netProfit.toFixed(2)}</span> de lucro real.</p>
                    </div>
                  </div>
                </div>
             </div>
             <div className="flex justify-between pt-4">
              <button type="button" onClick={() => setStep(2)} className="px-8 py-3 text-brand-primary font-bold">Voltar</button>
              <button 
                type="button" 
                onClick={handleFinish} 
                className="bg-brand-primary text-white font-bold px-16 py-4 rounded-2xl shadow-xl hover:bg-brand-secondary transition-all"
              >
                Confirmar e Salvar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pop-up de Confirmação de Remoção de Material da Lista */}
      {materialIdxToRemove !== null && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center space-y-6 transform transition-all animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
              🗑️
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">Remover material?</h3>
              <p className="text-gray-500 text-sm">Deseja realmente remover este item da lista de composição do produto?</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={confirmRemoveMaterial}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-colors shadow-md"
              >
                Sim, remover
              </button>
              <button 
                onClick={() => setMaterialIdxToRemove(null)}
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

export default ProductWizard;
