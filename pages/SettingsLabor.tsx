
import React, { useState, useEffect } from 'react';
import { useStorage } from '../App';
import { LaborSettings } from '../types';

const SettingsLabor: React.FC = () => {
  const { data, updateLabor } = useStorage();
  const [labor, setLabor] = useState<LaborSettings>(data.labor);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const totalMinutes = labor.daysPerMonth * labor.hoursPerDay * 60;
    const costMin = totalMinutes > 0 ? labor.desiredSalary / totalMinutes : 0;
    setLabor(prev => ({ ...prev, costPerMinute: parseFloat(costMin.toFixed(4)) }));
  }, [labor.desiredSalary, labor.daysPerMonth, labor.hoursPerDay]);

  const handleSave = () => {
    updateLabor(labor);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <h1 className="text-2xl font-bold font-display text-gray-800">Mão de Obra e Margem</h1>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-pink-50 space-y-6">
        <div className="flex items-center space-x-3 text-brand-primary mb-2">
          <span className="text-2xl">⏰</span>
          <h3 className="text-lg font-bold">Valor do seu Tempo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Salário Desejado (R$)</label>
            <input
              type="number"
              value={labor.desiredSalary}
              onChange={(e) => setLabor({ ...labor, desiredSalary: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Dias p/ mês</label>
            <input
              type="number"
              value={labor.daysPerMonth}
              onChange={(e) => setLabor({ ...labor, daysPerMonth: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Horas p/ dia</label>
            <input
              type="number"
              value={labor.hoursPerDay}
              onChange={(e) => setLabor({ ...labor, hoursPerDay: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-bold"
            />
          </div>
        </div>

        <div className="bg-brand-accent rounded-2xl p-6 text-center border border-pink-100">
          <p className="text-gray-600 font-medium">Seu minuto custa:</p>
          <p className="text-4xl font-bold text-brand-primary mt-1">
            {formatCurrency(labor.costPerMinute)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-pink-50 space-y-4">
        <div className="flex items-center space-x-3 text-brand-primary mb-2">
          <span className="text-2xl">🖨️</span>
          <h3 className="text-lg font-bold">Custos de Máquina</h3>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">Custo de impressão p/ folha (R$)</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              step="0.01"
              value={labor.printingCostPerSheet}
              onChange={(e) => setLabor({ ...labor, printingCostPerSheet: Number(e.target.value) })}
              className="flex-1 px-4 py-3 rounded-xl border border-pink-100 focus:border-brand-primary outline-none bg-white text-gray-900 font-bold"
            />
            <div className="text-xs text-gray-500 max-w-[240px]">
              Consideramos impressão em impressora Jato de Tinta. <br/>
              <span className="font-bold text-brand-primary">Preço Recomendado: R$ 0,50 - R$ 1,00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-pink-50 space-y-6">
        <div className="flex items-center space-x-3 text-brand-primary mb-2">
          <span className="text-2xl">📈</span>
          <h3 className="text-lg font-bold">Margem de Lucro Recomendada (%)</h3>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center">
            <span className="text-6xl font-bold text-brand-primary">{labor.defaultMargin}%</span>
          </div>
          
          <div className="space-y-4 px-4 relative">
            <input
              type="range"
              min="0"
              max="120"
              step="1"
              value={labor.defaultMargin}
              onChange={(e) => setLabor({ ...labor, defaultMargin: Number(e.target.value) })}
              className="w-full accent-brand-primary h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between w-full text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <div className="text-left w-1/4">
                <span>LUCRO BAIXO</span>
                <p>30%</p>
              </div>
              <div className="text-center w-2/4 text-brand-primary">
                <span>IDEAL</span>
                <p>60%</p>
              </div>
              <div className="text-right w-1/4">
                <span>LUCRO ALTO</span>
                <p>100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center pt-4">
        <button
          onClick={handleSave}
          className="w-full md:w-auto px-12 py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg hover:bg-brand-secondary transition-all active:scale-95"
        >
          Salvar Configuração de Lucro
        </button>
        {success && <p className="mt-3 text-green-500 font-bold animate-pulse">Salvo com sucesso! ✨</p>}
      </div>
    </div>
  );
};

export default SettingsLabor;
