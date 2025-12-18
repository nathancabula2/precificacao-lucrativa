
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppData, StudioSettings, LaborSettings, Material, Product, Budget } from './types';
import { DEFAULT_STUDIO, DEFAULT_LABOR, DEFAULT_MATERIALS } from './constants';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SettingsStudio from './pages/SettingsStudio';
import SettingsLabor from './pages/SettingsLabor';
import Materials from './pages/Materials';
import ProductWizard from './pages/ProductWizard';
import ProductList from './pages/ProductList';
import Budgets from './pages/Budgets';
import Help from './pages/Help';

// Storage Context
interface StorageContextType {
  data: AppData;
  updateStudio: (studio: StudioSettings) => void;
  updateLabor: (labor: LaborSettings) => void;
  setMaterials: (materials: Material[]) => void;
  setProducts: (products: Product[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  login: () => void;
  logout: () => void;
}

const StorageContext = createContext<StorageContextType | null>(null);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) throw new Error("useStorage must be used within StorageProvider");
  return context;
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('precificacao_lucrativa_data');
    if (saved) return JSON.parse(saved);
    return {
      studio: DEFAULT_STUDIO,
      labor: DEFAULT_LABOR,
      materials: DEFAULT_MATERIALS,
      products: [],
      budgets: [],
      isLoggedIn: false
    };
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('precificacao_lucrativa_data', JSON.stringify(data));
  }, [data]);

  const updateStudio = (studio: StudioSettings) => setData(prev => ({ ...prev, studio }));
  const updateLabor = (labor: LaborSettings) => setData(prev => ({ ...prev, labor }));
  const setMaterials = (materials: Material[]) => setData(prev => ({ ...prev, materials }));
  const setProducts = (products: Product[]) => setData(prev => ({ ...prev, products }));
  const setBudgets = (budgets: Budget[]) => setData(prev => ({ ...prev, budgets }));
  const login = () => setData(prev => ({ ...prev, isLoggedIn: true }));
  const logout = () => {
    setData(prev => ({ ...prev, isLoggedIn: false }));
    navigate('/');
  };

  return (
    <StorageContext.Provider value={{ data, updateStudio, updateLabor, setMaterials, setProducts, setBudgets, login, logout }}>
      <Routes>
        <Route path="/" element={data.isLoggedIn ? <Navigate to="/painel" /> : <Login />} />
        
        {data.isLoggedIn && (
          <Route element={<Layout />}>
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/config/estudio" element={<SettingsStudio />} />
            <Route path="/config/mao-de-obra" element={<SettingsLabor />} />
            <Route path="/materiais" element={<Materials />} />
            <Route path="/produto/novo" element={<ProductWizard />} />
            <Route path="/produto/novo/:id" element={<ProductWizard />} />
            <Route path="/produtos" element={<ProductList />} />
            <Route path="/orcamentos" element={<Budgets />} />
            <Route path="/ajuda" element={<Help />} />
          </Route>
        )}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </StorageContext.Provider>
  );
};

export default App;
