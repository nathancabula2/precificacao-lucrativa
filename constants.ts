
export const HELP_MAP: Record<string, { title: string; steps: string[] }> = {
  dashboard: {
    title: "Painel Geral",
    steps: [
      "Bem-vinda ao seu ateliê! Aqui você vê um resumo rápido.",
      "Use os cartões de atalho para acessar rapidamente as funções principais.",
      "Fique de olho no número de produtos e orçamentos criados."
    ]
  },
  settings_studio: {
    title: "Minha Papelaria",
    steps: [
      "Cadastre o nome e o WhatsApp do seu ateliê.",
      "Suba sua logo para personalizar seus orçamentos em PDF.",
      "Configure seus dados de PIX para facilitar o pagamento das clientes.",
      "As observações padrão aparecerão no final do orçamento."
    ]
  },
  settings_labor: {
    title: "Mão de Obra e Margem",
    steps: [
      "Defina quanto você deseja ganhar por mês e sua jornada de trabalho.",
      "O sistema calculará automaticamente o custo do seu minuto.",
      "Informe o custo de impressão (tinta + desgaste da máquina).",
      "Defina uma margem de lucro padrão para seus novos produtos."
    ]
  },
  materials: {
    title: "Materiais e Insumos",
    steps: [
      "Cadastre tudo o que você usa: papéis, fitas, colas, etc.",
      "Se comprar em pacotes, o sistema calcula o custo unitário para você.",
      "Mantenha os custos atualizados para garantir que seu lucro seja real."
    ]
  },
  product_wizard: {
    title: "Cadastro de Produto",
    steps: [
      "Passo 1: Escolha entre Caixinhas ou Lembrancinhas.",
      "Passo 2: Defina a linha (Básica, Clássica ou Luxo) para gerar descrições automáticas.",
      "Passo 3: Adicione os materiais usados e o tempo que leva para montar.",
      "Passo 4: Ajuste a margem de lucro e confirme o preço sugerido."
    ]
  },
  product_list: {
    title: "Produtos Criados",
    steps: [
      "Aqui estão todos os seus produtos cadastrados.",
      "Você pode ver o preço de venda e o lucro líquido de cada item.",
      "Clique em editar para ajustar custos ou em excluir para remover do catálogo."
    ]
  },
  budgets: {
    title: "Orçamentos",
    steps: [
      "Crie orçamentos profissionais selecionando itens do seu catálogo.",
      "Informe o nome da cliente e, opcionalmente, o WhatsApp.",
      "Gere um PDF lindo para enviar ou compartilhe o resumo pelo WhatsApp."
    ]
  }
};

export const DEFAULT_STUDIO: any = {
  name: "",
  whatsapp: "",
  pixType: "CPF",
  pixKey: "",
  notes: "Orçamento válido por 15 dias. Início da produção após confirmação de pagamento."
};

export const DEFAULT_LABOR: any = {
  desiredSalary: 2000,
  daysPerMonth: 22,
  hoursPerDay: 8,
  costPerMinute: 0.19,
  printingCostPerSheet: 0.5,
  defaultMargin: 60
};

export const DEFAULT_MATERIALS: any[] = [
  {
    id: 'm1',
    name: 'Papel Offset',
    unit: 'folha',
    purchaseType: 'pacote',
    packagePrice: 220,
    packageQuantity: 1000,
    unitCost: 0.22,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'm2',
    name: 'Papel Fotográfico',
    unit: 'folha',
    purchaseType: 'pacote',
    packagePrice: 30,
    packageQuantity: 100,
    unitCost: 0.3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'm3',
    name: 'Cola Pano',
    unit: 'ml',
    purchaseType: 'pacote',
    packagePrice: 14,
    packageQuantity: 100,
    unitCost: 0.14,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'm4',
    name: 'Fita de Cetim',
    unit: 'metro',
    purchaseType: 'pacote',
    packagePrice: 10,
    packageQuantity: 10,
    unitCost: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'm5',
    name: 'Chaton/Pedrarias',
    unit: 'un',
    purchaseType: 'unitario',
    unitCost: 0.1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
