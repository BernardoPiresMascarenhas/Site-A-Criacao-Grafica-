
export interface PortfolioItem {
  image: string;
  title: string;
  description: string;
}


export interface Service {
  id: number;
  title: string;
  description: string; 
  coverImage: string; 
  portfolioItems: PortfolioItem[]; 
  wpplink: string;
}


export const servicesData: Service[] = [
  {
    id: 1,
    title: 'Cardápios',
    description: 'Exiba os seus melhores pratos em cardápios da melhor qualidade.',
    coverImage: '/cardapio.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20cartões%20de%20visita.',
    portfolioItems: [
      {
        image: '/cardapio.png',
        title: 'Cardápio',
        description: 'Exiba os seus melhores pratos em cardápios da melhor qualidade.'
      },
      {
        image: '/cardapio.png',
        title: 'Cardápio',
        description: 'Estilo moderno e amigável em papel reciclado, perfeito para um público jovem.'
      },
      {
        image: '/cardapio.png',
        title: 'Cartão com QR Code',
        description: 'Exiba os seus melhores pratos em cardápios da melhor qualidade.'
      }
    ]
  },
  {
    id: 2,
    title: 'Cartões de visita',
    description: 'Demonstre profissionalismo com belos cartões de visita.',
    coverImage: '/cartaodevisita.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/cartaodevisita.png',
        title: 'Cartões de visita',
        description: 'Demonstre profissionalismo com belos cartões de visita.'
      },
      {
        image: '/cartaodevisita.png',
        title: 'Cartões de visita',
        description: 'Demonstre profissionalismo com belos cartões de visita.'
      }
    ]
  },

  {
    id: 3,
    title: 'Revistas',
    description: 'Qualidade da produção à entrega, e de forma rápida.',
    coverImage: '/revista.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/revista.png',
        title: 'Revistas',
        description: 'Qualidade da produção à entrega, e de forma rápida.'
      },
      {
        image: '/revista.png',
        title: 'Revistas',
        description: 'Qualidade da produção à entrega, e de forma rápida.'
      }
    ]
  },

  {
    id: 4,
    title: 'Crachás para eventos',
    description: 'Possibilitam uma rápida visualização da equipe de apoio.',
    coverImage: '/cracha.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/cracha.png',
        title: 'Crachás para eventos',
        description: 'Possibilitam uma rápida visualização da equipe de apoio.'
      },
      {
        image: '/cracha.png',
        title: 'Crachás para eventos',
        description: 'Possibilitam uma rápida visualização da equipe de apoio.'
      }
    ]
  },
  
  {
    id: 5,
    title: 'Livros',
    description: 'Ideal Para Editoras e Autores Independentes.',
    coverImage: '/livros.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/livros.png',
        title: 'Livros',
        description: 'Ideal Para Editoras e Autores Independentes.'
      },
      {
        image: '/livros.png',
        title: 'Livros',
        description: 'Ideal Para Editoras e Autores Independentes.'
      }
    ]
  },
  {
    id: 6,
    title: 'Caderno',
    description: 'Ótimos preços e Qualidade Surpreendente.',
    coverImage: '/caderno.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/caderno.png',
        title: 'Caderno',
        description: 'Ótimos preços e Qualidade Surpreendente.'
      },
      {
        image: '/caderno.png',
        title: 'Caderno',
        description: 'Ótimos preços e Qualidade Surpreendente.'
      }
    ]
  },
  {
    id: 7,
    title: 'Placas de sinalização',
    description: 'Nossas placas atendem diversos tipos de necessidades.',
    coverImage: '/placa.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/placa.png',
        title: 'Placas de sinalização',
        description: 'Nossas placas atendem diversos tipos de necessidades.'
      },
      {
        image: '/placa.png',
        title: 'Placas de sinalização',
        description: 'Nossas placas atendem diversos tipos de necessidades.'
      }
    ]
  },
  {
    id: 8,
    title: 'Tags',
    description: 'Esse material pode ser aplicado a diversos segmentos.',
    coverImage: '/tags.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/tags.png',
        title: 'Tags',
        description: 'Esse material pode ser aplicado a diversos segmentos.'
      },
      {
        image: '/tags.png',
        title: 'Tags',
        description: 'Esse material pode ser aplicado a diversos segmentos.'
      }
    ]
  },
  {
    id: 9,
    title: 'Panfletos',
    description: 'Panfletos de alta qualidade com o melhor preço de BH.',
    coverImage: '/panfletos.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/panfletos.png',
        title: 'Panfletos',
        description: 'Panfletos de alta qualidade com o melhor preço de BH.'
      },
      {
        image: '/panfletos.png',
        title: 'Panfletos',
        description: 'Panfletos de alta qualidade com o melhor preço de BH.'
      }
    ]
  },
  {
    id: 10,
    title: 'Banners',
    description: 'Imprima Banner personalizado de qualidade.',
    coverImage: '/banner.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/banner.png',
        title: 'Banner para Evento Acadêmico',
        description: 'Banner em lona fosca para evitar reflexos de luz, com ilhós para fácil instalação.'
      },
      {
        image: '/banner.png',
        title: 'Lona para Fachada de Loja',
        description: 'Impressão em alta resolução com material resistente ao sol e à chuva.'
      }
    ]
  },
  {
    id: 11,
    title: 'Adesivo Vinil',
    description: 'Comunicação visual, informativo ou decorativo.',
    coverImage: '/adesivovinil.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/adesivovinil2.png',
        title: 'Adesivo Vinil',
        description: 'Esse material pode ser usado em decoração de ambientes.'
      },
      {
        image: '/adesivovinil3.png',
        title: 'Adesivo Vinil',
        description: 'Comunicação visual, sua impressão na cor real.'
      },
      {
        image: '/adesivovinil4.png',
        title: 'Adesivo Vinil',
        description: 'Comunicação visual, informativo ou decorativo.'
      },
      {
        image: '/adesivovinil5.png',
        title: 'Adesivo Vinil',
        description: 'Comunicação visual.'
      },
      {
        image: '/adesivovinil6.png',
        title: 'Adesivo Vinil',
        description: 'Comunicação visual.'
      },
      {
        image: '/adesivovinil7.png',
        title: 'Adesivo Vinil',
        description: 'Comunicação visual.'
      }
    ]
  },
  {
    id: 12,
    title: 'Envelopamento',
    description: 'Comunicação visual.',
    coverImage: '/envelopamento.png',
    wpplink: 'https://wa.me/SEUNUMERO?text=Olá,%20gostaria%20de%20um%20orçamento%20para%20banners.',
    portfolioItems: [
      {
        image: '/envelopamento.png',
        title: 'Envelopamento',
        description: 'Comunicação visual.'
      },
      {
        image: '/envelopamento.png',
        title: 'Envelopamento',
        description: 'Comunicação visual.'
      }
    ]
  },
];