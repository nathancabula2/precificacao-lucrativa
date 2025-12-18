
import React, { useState } from 'react';
import { useStorage } from '../App';
import { Material, UnitType, PurchaseType } from '../types';

const Materials: React.FC = () => {
  const { data, setMaterials } = useStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  
  // Estado para o pop-up de confirmação de exclusão
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<UnitType>('folha');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('pacote');
  const [packagePrice, setPackagePrice] = useState<number | string>('');
  const [packageQuantity, setPackageQuantity] = useState<number | string>('');
  const [unitCost, setUnitCost] = useState<number | string>('');

  const resetForm = () => {
    setName('');
    setUnit('folha');
    setPurchaseType('pacote');
    setPackagePrice('');
    setPackageQuantity('');
    setUnitCost('');
    setEditingMaterial(null);
  };

  const handleOpenModal = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setName(material.name);
      setUnit(material.unit);
      setPurchaseType(material.purchaseType);
      setPackagePrice(material.packagePrice || '');
      setPackageQuantity(material.packageQuantity || '');
      setUnitCost(material.unitCost);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let calculatedUnitCost = 0;
    if (purchaseType === 'pacote') {
      calculatedUnitCost = Number(packagePrice) / Number(packageQuantity);
    } else {
      calculatedUnitCost = Number(unitCost);
    }

    const newMaterial: Material = {
      id: editingMaterial?.id || crypto.randomUUID(),
      name,
      unit,
      purchaseType,
      packagePrice: purchaseType === 'pacote' ? Number(packagePrice) : undefined,
      packageQuantity: purchaseType === 'pacote' ? Number(packageQuantity) : undefined,
      unitCost: calculatedUnitCost,
      createdAt: editingMaterial?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    if (editingMaterial) {
      setMaterials(data.materials.map(m => m.id === editingMaterial.id ? newMaterial : m));
    } else {
      setMaterials([...data.materials, newMaterial]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setMaterials(data.materials.filter(m => m.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const currentCalc = purchaseType === 'pacote' && packagePrice && packageQuantity 
    ? (Number(packagePrice) / Number(packageQuantity)).toFixed(2)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-800">Insumos</h1>
          <p className="text-gray-500">Cadastre papel, fita, cola e pedrarias.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-primary text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-brand-secondary transition-all flex items-center justify-center space-x-2"
        >
          <span>+</span>
          <span>Novo Material</span>
        </button>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-pink-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-accent text-brand-primary text-sm font-bold border-b border-pink-100">
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Tipo Compra</th>
                <th className="px-6 py-4">Custo Unitário</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {data.materials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Nenhum material cadastrado ainda. Comece criando um! ✨
                  </td>
                </tr>
              ) : (
                data.materials.map(material => (
                  <tr key={material.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{material.name}</div>
                      <div className="text-xs text-gray-500">por {material.unit}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {material.purchaseType === 'pacote' 
                        ? `Pacote R$ ${material.packagePrice?.toFixed(2)} (${material.packageQuantity} ${material.unit})`
                        : 'Unitário'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-primary">
                        R$ {material.unitCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          type="button"
                          onClick={() => handleOpenModal(material)} 
                          className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          type="button"
                          onClick={() => setItemToDelete(material.id)} 
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-brand-primary p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-display">{editingMaterial ? 'Editar' : 'Novo'} Insumo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Nome do Material</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Papel Fotográfico 180g"
                  className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Como você usa?</label>
                <div className="flex flex-wrap gap-2">
                  {(['folha', 'metro', 'un', 'ml'] as UnitType[]).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        unit === u ? 'bg-brand-primary text-white' : 'bg-brand-accent text-brand-primary border border-pink-100'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-brand-accent rounded-2xl p-6 space-y-4 border border-pink-100">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPurchaseType('pacote')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      purchaseType === 'pacote' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    Compro Pacote/Rolo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchaseType('unitario')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      purchaseType === 'unitario' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    Compro Unitário
                  </button>
                </div>

                {purchaseType === 'pacote' ? (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-primary uppercase">Preço Pacote (R$)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={packagePrice}
                        onChange={(e) => setPackagePrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-brand-primary outline-none bg-white text-gray-900 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-primary uppercase">Qtd no Pacote ({unit})</label>
                      <input
                        required
                        type="number"
                        value={packageQuantity}
                        onChange={(e) => setPackageQuantity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-brand-primary outline-none bg-white text-gray-900 font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-bold text-brand-primary uppercase">Custo por {unit} (R$)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={unitCost}
                      onChange={(e) => setUnitCost(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-brand-primary outline-none bg-white text-gray-900 font-bold"
                    />
                  </div>
                )}

                {currentCalc && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500">Custo por {unit}:</p>
                    <p className="text-xl font-bold text-brand-primary">R$ {currentCalc}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-brand-secondary transition-all"
              >
                Salvar Material
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pop-up de Confirmação de Exclusão */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center space-y-6 transform transition-all animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">
              🗑️
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">Deseja realmente excluir?</h3>
              <p className="text-gray-500 text-sm">Esta ação removerá este material permanentemente e não pode ser desfeita.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={confirmDelete}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-colors shadow-md"
              >
                Sim, excluir
              </button>
              <button 
                onClick={() => setItemToDelete(null)}
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

export default Materials;
