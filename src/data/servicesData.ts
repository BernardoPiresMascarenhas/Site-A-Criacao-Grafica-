// No seu arquivo src/data/servicesData.ts

// --- INTERFACES ATUALIZADAS ---

// Interface para os campos do formulário da calculadora
export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text'; // Adicionei 'text' para flexibilidade
  options?: { value: string | number; label: string }[];
  defaultValue?: string | number;
  placeholder?: string;
}

// Interface para a calculadora de um serviço
export interface Calculator {
  fields: FormField[];
  formula: (values: { [key: string]: any }) => number | null;
}

// Interface para um item do portfólio
export interface PortfolioItem {
  id: number; // Adicionei um ID para melhor performance no React
  image: string;
  title: string;
  description: string;
}

// Interface principal de um serviço, agora com a calculadora opcional
export interface Service {
  id: number;
  title:string;
  description: string;
  coverImage: string;
  portfolioItems: PortfolioItem[];
  wpplink: string;
  calculator?: Calculator; // O '?' torna o campo opcional
}


// --- DADOS DOS SERVIÇOS ATUALIZADOS ---

export const servicesData: Service[] = [
  {
    id: 1,
    title: 'Cardápios',
    description: 'Exiba os seus melhores pratos em cardápios da melhor qualidade.',
    coverImage: '/cardapio.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Cardápios.',
    portfolioItems: [
      { id: 1, image: '/cardapio.png', title: 'Cardápio de Restaurante', description: 'Cardápio robusto com laminação para maior durabilidade.' },
      { id: 2, image: '/cardapio.png', title: 'Cardápio de Bar', description: 'Design moderno e prático, ideal para bebidas e petiscos.' },
      { id: 3, image: '/cardapio.png', title: 'Cardápio com QR Code', description: 'Integre seu cardápio físico com o digital.' }
    ],
    calculator: {
      fields: [
        { name: 'quantidade', label: 'Quantidade', type: 'number', defaultValue: 10, placeholder: 'Ex: 10' },
        { name: 'paginas', label: 'Número de Páginas', type: 'number', defaultValue: 2, placeholder: 'Ex: 2' },
        {
          name: 'material', label: 'Material e Acabamento', type: 'select', defaultValue: 'couche_250g',
          options: [
            { value: 'couche_250g', label: 'Couchê 250g com Laminação' },
            { value: 'pvc_05mm', label: 'PVC 0.5mm (Mais Rígido)' },
            { value: 'sintetico', label: 'Papel Sintético (À prova d\'água)' },
          ]
        },
      ],
      formula: (values) => {
        if (!values.quantidade || !values.paginas) return null;
        const custoPorPagina = 2.50;
        let multiplicadorMaterial = 1;
        if (values.material === 'pvc_05mm') multiplicadorMaterial = 2.5;
        if (values.material === 'sintetico') multiplicadorMaterial = 2;
        // Fórmula de exemplo
        return (values.paginas * custoPorPagina * multiplicadorMaterial) * values.quantidade;
      }
    }
  },
  {
    id: 2,
    title: 'Cartões de visita',
    description: 'Demonstre profissionalismo com belos cartões de visita.',
    coverImage: '/cartaodevisita.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Cartões%20de%20Visita.',
    portfolioItems: [
      { id: 1, image: '/cartaodevisita.png', title: 'Cartão Padrão', description: 'Acabamento profissional em couchê 300g.' },
      { id: 2, image: '/cartaodevisita.png', title: 'Cartão com Verniz Localizado', description: 'Destaque seu logo e informações importantes com um toque de brilho.' }
    ],
    calculator: {
      fields: [
        {
          name: 'quantidade', label: 'Quantidade', type: 'select', defaultValue: 1000,
          options: [
            { value: 500, label: '500 Unidades' },
            { value: 1000, label: '1000 Unidades' },
          ]
        },
        {
          name: 'acabamento', label: 'Acabamento', type: 'select', defaultValue: 'fosco_uv',
          options: [
            { value: 'fosco_uv', label: 'Laminação Fosca + Verniz Localizado' },
            { value: 'fosco_simples', label: 'Apenas Laminação Fosca' },
            { value: 'sem_acabamento', label: 'Sem Acabamento Extra' },
          ]
        },
      ],
      formula: (values) => {
        if (!values.quantidade) return null;
        let precoBase = values.quantidade === 1000 ? 150 : 95;
        if (values.acabamento === 'fosco_simples') precoBase *= 0.85;
        if (values.acabamento === 'sem_acabamento') precoBase *= 0.7;
        return precoBase;
      }
    }
  },
  {
    id: 3,
    title: 'Revistas',
    description: 'Qualidade da produção à entrega, e de forma rápida.',
    coverImage: '/revista.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Revistas.',
    portfolioItems: [
        { id: 1, image: '/revista.png', title: 'Revista Corporativa', description: 'Ideal para relatórios anuais e publicações internas.' },
        { id: 2, image: '/revista.png', title: 'Catálogo de Produtos', description: 'Mostre seus produtos com fotos de alta qualidade.' }
    ],
    calculator: {
      fields: [
        { name: 'quantidade', label: 'Quantidade de Revistas', type: 'number', defaultValue: 100 },
        { name: 'paginas', label: 'Número Total de Páginas', type: 'number', defaultValue: 16 },
        { name: 'gramatura_miolo', label: 'Papel do Miolo', type: 'select', defaultValue: 'couche_115g',
          options: [
            { value: 'couche_90g', label: 'Couchê 90g' },
            { value: 'couche_115g', label: 'Couchê 115g' },
          ]
        },
        { name: 'gramatura_capa', label: 'Papel da Capa', type: 'select', defaultValue: 'couche_250g',
          options: [
            { value: 'couche_170g', label: 'Couchê 170g' },
            { value: 'couche_250g', label: 'Couchê 250g (Recomendado)' },
          ]
        },
      ],
      formula: (values) => {
        if (!values.quantidade || !values.paginas) return null;
        const custoMiolo = values.gramatura_miolo === 'couche_115g' ? 0.30 : 0.25;
        const custoCapa = values.gramatura_capa === 'couche_250g' ? 1.50 : 1.00;
        const custoPorRevista = (custoMiolo * (values.paginas - 4)) + custoCapa;
        return custoPorRevista * values.quantidade;
      }
    }
  },
  {
    id: 4,
    title: 'Crachás para eventos',
    description: 'Possibilitam uma rápida visualização da equipe de apoio.',
    coverImage: '/cracha.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Crachás.',
    portfolioItems: [
        { id: 1, image: '/cracha.png', title: 'Crachá em PVC', description: 'Crachá rígido e durável, ideal para uso contínuo.' },
        { id: 2, image: '/cracha.png', title: 'Crachá com Cordão Personalizado', description: 'Inclui cordão com a marca do seu evento.' }
    ],
    calculator: {
      fields: [
        { name: 'quantidade', label: 'Quantidade de Crachás', type: 'number', defaultValue: 50 },
        { name: 'material', label: 'Material', type: 'select', defaultValue: 'pvc_076mm',
          options: [
            { value: 'pvc_076mm', label: 'PVC 0.76mm (Padrão Cartão de Crédito)' },
            { value: 'papel_300g', label: 'Papel 300g com Laminação' },
          ]
        },
        { name: 'cordao', label: 'Incluir Cordão?', type: 'select', defaultValue: 'sim',
          options: [
            { value: 'sim', label: 'Sim, cordão simples' },
            { value: 'sim_personalizado', label: 'Sim, cordão personalizado' },
            { value: 'nao', label: 'Não, apenas o crachá' },
          ]
        }
      ],
      formula: (values) => {
        if (!values.quantidade) return null;
        let custoCracha = values.material === 'pvc_076mm' ? 7.50 : 4.00;
        let custoCordao = 0;
        if (values.cordao === 'sim') custoCordao = 2.00;
        if (values.cordao === 'sim_personalizado') custoCordao = 4.50;
        return (custoCracha + custoCordao) * values.quantidade;
      }
    }
  },
  {
    id: 5,
    title: 'Livros',
    description: 'Ideal Para Editoras e Autores Independentes.',
    coverImage: '/livros.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Livros.',
    portfolioItems: [
      { id: 1, image: '/livros.png', title: 'Livro Brochura', description: 'Capa flexível, ideal para grandes tiragens.' },
      { id: 2, image: '/livros.png', title: 'Livro Capa Dura', description: 'Acabamento premium e de alta durabilidade.' }
    ],
    // A calculadora de livros é complexa. Este é um exemplo simplificado.
    calculator: {
      fields: [
        { name: 'quantidade', label: 'Quantidade de Livros', type: 'number', defaultValue: 50 },
        { name: 'paginas', label: 'Número de Páginas', type: 'number', defaultValue: 120 },
        { name: 'capa', label: 'Tipo de Capa', type: 'select', defaultValue: 'brochura',
          options: [
            { value: 'brochura', label: 'Brochura (Capa Flexível)' },
            { value: 'dura', label: 'Capa Dura' },
          ]
        }
      ],
      formula: (values) => {
        if (!values.quantidade || !values.paginas) return null;
        const custoCapa = values.capa === 'dura' ? 25.00 : 8.00;
        const custoPagina = 0.18;
        return (custoCapa + (values.paginas * custoPagina)) * values.quantidade;
      }
    }
  },
  {
    id: 6,
    title: 'Caderno',
    description: 'Ótimos preços e Qualidade Surpreendente.',
    coverImage: '/caderno.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Cadernos.',
    portfolioItems: [
      { id: 1, image: '/caderno.png', title: 'Caderno Personalizado', description: 'Caderno com capa e miolo personalizados.' },
      { id: 2, image: '/caderno.png', title: 'Caderno Corporativo', description: 'Ideal para brindes e uso interno na empresa.' }
    ],
    calculator: {
        fields: [
            { name: 'quantidade', label: 'Quantidade', type: 'number', defaultValue: 20 },
            { name: 'folhas', label: 'Número de Folhas', type: 'select', defaultValue: 50,
                options: [
                    { value: 50, label: '50 Folhas' },
                    { value: 100, label: '100 Folhas' },
                ]
            },
            { name: 'capa', label: 'Tipo de Capa', type: 'select', defaultValue: 'dura',
              options: [
                { value: 'dura', label: 'Capa Dura Personalizada' },
                { value: 'flexivel', label: 'Capa Flexível 300g' },
              ]
            }
        ],
        formula: (values) => {
            if (!values.quantidade) return null;
            let custoBase = values.capa === 'dura' ? 15.00 : 9.00;
            let custoFolhas = values.folhas === 100 ? 5.00 : 2.50;
            return (custoBase + custoFolhas) * values.quantidade;
        }
    }
  },
  {
    id: 7,
    title: 'Placas de sinalização',
    description: 'Nossas placas atendem diversos tipos de necessidades.',
    coverImage: '/placa.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Placas.',
    portfolioItems: [
      { id: 1, image: '/placa.png', title: 'Placa de PVC', description: 'Placas informativas para ambientes internos e externos.' },
      { id: 2, image: '/placa.png', title: 'Placa de Acrílico', description: 'Acabamento sofisticado para recepções e escritórios.' }
    ],
    calculator: {
      fields: [
        { name: 'largura', label: 'Largura (cm)', type: 'number', defaultValue: 30 },
        { name: 'altura', label: 'Altura (cm)', type: 'number', defaultValue: 20 },
        { name: 'material', label: 'Material', type: 'select', defaultValue: 'pvc_2mm',
          options: [
            { value: 'pvc_2mm', label: 'PVC 2mm' },
            { value: 'acrilico_3mm', label: 'Acrílico 3mm' },
          ]
        }
      ],
      formula: (values) => {
        if (!values.largura || !values.altura) return null;
        const area_m2 = (values.largura * values.altura) / 10000;
        const preco_m2 = values.material === 'acrilico_3mm' ? 450 : 250;
        let custoFinal = area_m2 * preco_m2;
        // Adiciona um custo mínimo para peças pequenas
        return Math.max(custoFinal, 35.00);
      }
    }
  },
  {
    id: 8,
    title: 'Tags',
    description: 'Esse material pode ser aplicado a diversos segmentos.',
    coverImage: '/tags.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Tags.',
    portfolioItems: [
      { id: 1, image: '/tags.png', title: 'Tags para Roupas', description: 'Agregue valor à sua marca com tags personalizadas.' },
      { id: 2, image: '/tags.png', title: 'Tags para Lembrancinhas', description: 'Um toque especial para seus presentes e lembranças.' }
    ],
    calculator: {
      fields: [
        { name: 'quantidade', label: 'Quantidade', type: 'select', defaultValue: 1000,
          options: [
            { value: 500, label: '500 Unidades' },
            { value: 1000, label: '1000 Unidades' },
            { value: 2000, label: '2000 Unidades' },
          ]
        },
        { name: 'papel', label: 'Tipo de Papel', type: 'select', defaultValue: 'couche_300g',
          options: [
            { value: 'couche_300g', label: 'Couchê 300g' },
            { value: 'kraft_280g', label: 'Kraft 280g' },
          ]
        }
      ],
      formula: (values) => {
        if (!values.quantidade) return null;
        let precoMilheiro = values.papel === 'kraft_280g' ? 140 : 120;
        return (values.quantidade / 1000) * precoMilheiro;
      }
    }
  },
  {
    id: 9,
    title: 'Panfletos',
    description: 'Panfletos de alta qualidade com o melhor preço de BH.',
    coverImage: '/panfletos.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Panfletos.',
    portfolioItems: [
      { id: 1, image: '/panfletos.png', title: 'Panfleto de Divulgação', description: 'Ideal para promoções e eventos.' },
      { id: 2, image: '/panfletos.png', title: 'Flyer para Delivery', description: 'Design atrativo para impulsionar seus pedidos.' }
    ],
    calculator: {
      fields: [
        { name: 'quantidade', label: 'Quantidade', type: 'select', defaultValue: 2500,
          options: [
            { value: 1000, label: '1000 Unidades' },
            { value: 2500, label: '2500 Unidades' },
            { value: 5000, label: '5000 Unidades' },
          ]
        },
        { name: 'papel', label: 'Papel', type: 'select', defaultValue: 'couche_90g',
          options: [
            { value: 'couche_90g', label: 'Couchê 90g' },
            { value: 'couche_115g', label: 'Couchê 115g' },
          ]
        },
        { name: 'impressao', label: 'Impressão', type: 'select', defaultValue: '4x4',
          options: [
            { value: '4x0', label: 'Frente Colorida, Verso em Branco' },
            { value: '4x4', label: 'Frente e Verso Coloridos' },
          ]
        }
      ],
      formula: (values) => {
        let precoBase = 0;
        if (values.quantidade === 1000) precoBase = 180;
        if (values.quantidade === 2500) precoBase = 260;
        if (values.quantidade === 5000) precoBase = 380;
        if (values.papel === 'couche_115g') precoBase *= 1.15;
        if (values.impressao === '4x0') precoBase *= 0.8;
        return precoBase;
      }
    }
  },
  {
    id: 10,
    title: 'Banners',
    description: 'Imprima Banner personalizado de qualidade.',
    coverImage: '/banner.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Banners.',
    portfolioItems: [
      { id: 1, image: '/banner.png', title: 'Banner para Evento Acadêmico', description: 'Banner em lona fosca para evitar reflexos de luz, com ilhós para fácil instalação.' },
      { id: 2, image: '/banner.png', title: 'Lona para Fachada de Loja', description: 'Impressão em alta resolução com material resistente ao sol e à chuva.' }
    ],
    calculator: {
      fields: [
        { name: 'largura', label: 'Largura (cm)', type: 'number', defaultValue: 80 },
        { name: 'altura', label: 'Altura (cm)', type: 'number', defaultValue: 120 },
        { name: 'acabamento', label: 'Acabamento', type: 'select', defaultValue: 'ilhos',
          options: [
            { value: 'ilhos', label: 'Bastão, Corda e Ilhós' },
            { value: 'sem', label: 'Apenas a Lona (sem acabamento)' },
          ]
        }
      ],
      formula: (values) => {
        if (!values.largura || !values.altura) return null;
        const area_m2 = (values.largura * values.altura) / 10000;
        const preco_m2 = 90; // Preço por metro quadrado da lona impressa
        const custoAcabamento = values.acabamento === 'ilhos' ? 15 : 0;
        return (area_m2 * preco_m2) + custoAcabamento;
      }
    }
  },
  {
    id: 11,
    title: 'Adesivo Vinil',
    description: 'Comunicação visual, informativo ou decorativo.',
    coverImage: '/adesivovinil.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20Adesivos.',
    portfolioItems: [
      { id: 1, image: '/adesivovinil2.png', title: 'Adesivo para Vitrine', description: 'Promova suas ofertas e decore sua loja.' },
      { id: 2, image: '/adesivovinil3.png', title: 'Adesivo para Parede', description: 'Decoração de ambientes com impressão de alta qualidade.' },
      { id: 3, image: '/adesivovinil4.png', title: 'Rótulos Personalizados', description: 'Rótulos para produtos em vinil resistente.' }
    ],
    calculator: {
      fields: [
        { name: 'largura', label: 'Largura (cm)', type: 'number', defaultValue: 50 },
        { name: 'altura', label: 'Altura (cm)', type: 'number', defaultValue: 50 },
        { name: 'corte', label: 'Tipo de Corte', type: 'select', defaultValue: 'reto',
          options: [
            { value: 'reto', label: 'Corte Reto/Quadrado' },
            { value: 'especial', label: 'Corte Especial (Contorno)' },
          ]
        }
      ],
      formula: (values) => {
        if (!values.largura || !values.altura) return null;
        const area_m2 = (values.largura * values.altura) / 10000;
        let preco_m2 = 80;
        if (values.corte === 'especial') preco_m2 = 110;
        let custoFinal = area_m2 * preco_m2;
        // Custo mínimo
        return Math.max(custoFinal, 25.00);
      }
    }
  },
  {
    id: 12,
    title: 'Outros Serviços',
    description: 'Oferecemos diversas outras soluções em comunicação visual. Entre em contato para um orçamento personalizado.',
    coverImage: '/envelopamento.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20personalizado.',
    portfolioItems: [
      { id: 1, image: '/envelopamento.png', title: 'Envelopamento', description: 'Envelopamento de frotas e decoração de ambientes.' },
      { id: 2, image: '/calendario.png', title: 'Calendário', description: 'Calendários de mesa ou parede personalizados.' }
    ]
    // Sem calculadora para este, pois é um item genérico. O usuário será direcionado ao WhatsApp.
  },
];