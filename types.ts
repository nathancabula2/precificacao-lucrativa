
export type UnitType = 'folha' | 'metro' | 'un' | 'ml';
export type PurchaseType = 'pacote' | 'unitario';
export type ProductLine = 'BÁSICA' | 'CLÁSSICA' | 'LUXO';
export type ProductStatus = 'Caixinhas' | 'Lembrancinhas';

export interface StudioSettings {
  logo?: string;
  name: string;
  whatsapp: string;
  pixType: 'CPF' | 'CNPJ' | 'E-mail' | 'Telefone' | 'Aleatória';
  pixKey: string;
  notes: string;
}

export interface LaborSettings {
  desiredSalary: number;
  daysPerMonth: number;
  hoursPerDay: number;
  costPerMinute: number;
  printingCostPerSheet: number;
  defaultMargin: number;
}

export interface Material {
  id: string;
  name: string;
  unit: UnitType;
  purchaseType: PurchaseType;
  packagePrice?: number;
  packageQuantity?: number;
  unitCost: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProductMaterial {
  materialId: string;
  nameSnapshot: string;
  unitCostSnapshot: number;
  quantity: number;
}

export interface Product {
  id: string;
  category: ProductStatus;
  name: string;
  line: ProductLine;
  observations: string;
  assemblyMinutes: number;
  printingSheets: number;
  materials: ProductMaterial[];
  marginPercent: number;
  costMaterials: number;
  costLabor: number;
  costPrinting: number;
  costTotal: number;
  salePrice: number;
  netProfit: number;
  createdAt: number;
  updatedAt: number;
}

export interface BudgetItem {
  productId: string;
  nameSnapshot: string;
  lineSnapshot: ProductLine;
  descriptionSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  totalItem: number;
}

export interface Budget {
  id: string;
  clientName: string;
  clientPhone?: string;
  items: BudgetItem[];
  totalGeneral: number;
  createdAt: number;
  updatedAt: number;
}

export interface AppData {
  studio: StudioSettings;
  labor: LaborSettings;
  materials: Material[];
  products: Product[];
  budgets: Budget[];
  isLoggedIn: boolean;
}
