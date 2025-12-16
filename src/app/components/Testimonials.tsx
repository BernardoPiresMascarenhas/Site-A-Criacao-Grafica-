import React, { useState } from "react";
import Image from "next/image"; // IMPORTANTE: Importar o componente Image
import { Quote, Star, ChevronDown, ChevronUp, Award } from "lucide-react";

const Testimonials = () => {
  const [showAll, setShowAll] = useState(false);

  const featuredReview = {
      name: "Geraldo Veneroso", 
      relation: "Parceiro desde 2014",
      avatarSrc: "/geraldo.png", 
      text: `Trabalho com a Criação há mais de 10 anos e, durante todo esse tempo, a experiência tem sido sempre excepcional. A pontualidade na entrega é impressionante, o que transmite segurança e confiança em cada projeto. A qualidade dos impressos é impecável — cores vivas, nitidez perfeita e um acabamento que demonstra atenção a cada detalhe. O atendimento é outro ponto forte: a equipe é atenciosa, prestativa e sempre disposta a encontrar soluções criativas.

Seja para pequenas tiragens, grandes produções ou trabalhos de sinalização, o padrão de excelência é o mesmo. Além disso, os preços são justos, especialmente quando se considera o alto nível de qualidade entregue. É raro encontrar uma empresa que reúna, de forma tão consistente, comprometimento, competência e paixão pelo que faz.

Recomendo de olhos fechados a Criação, pois sei que, com eles, cada projeto será tratado com o máximo profissionalismo e dedicação.`
  };

  const reviews = [
    {
      name: "James Joe",
      relation: "Cliente",
      avatarSrc: "/james.png", 
      text: "O Curso Pré Absoluto é cliente da Criação Gráfica desde 2004, em todos esses anos sempre contamos com serviços de alta qualidade, pontualidade e excelentes preços. Hoje podemos afirmar que a parceria com a Criação agrega valor ao nossos serviços.",
    },
    {
        name: "Ana Cristina Pereira",
        relation: "Cliente",
        avatarSrc: "/ana.png", 
        text: "Fui super bem atendida! Precisei de um serviço rápido de última hora e eles fizeram com excelência! Ganharam uma cliente!",
      },
      {
          name: "Lucas Lavarini",
          relation: "Cliente",
          avatarSrc: "/lucas.png", 
          text: "Gráfica de excelente qualidade de impressão e acabamento, atendimento ótimo e rápido, equipe muito bem preparada.",
      },
      {
        name: "Fabricia Karla Silva",
        relation: "Cliente",
        avatarSrc: "/fabricia.png", 
        text: "Super recomendo. Atendimento excelente, empresa super prestativa, materiais de qualidade e preço justo.",
      },
    // "ver mais"
    {
        name: "Henriqueta Sanches",
        relation: "Cliente",
        avatarSrc: "/henriqueta.png", 
        text: "Trabalho Perfeito com muita qualidade! Atendimento espetacular! Ficamos encantadas com os critérios de aprovação de cada detalhe! Muito obrigada.",
    },
    {
        name: "Kma Soluções Gráficas",
        relation: "Cliente",
        avatarSrc: "/kma.png", 
        text: "Super recomendo, atendimento nota 10 e impressão e acabamento de qualidade!",
    },
    {
        name: "Bernardo Krauss",
        relation: "Cliente",
        avatarSrc: "/bernardo.png", 
        text: "Rápido, ágil e com ótimo preço. Atendimento fantastico.",
    },
    {
        name: "Rogerio Costa",
        relation: "Cliente",
        avatarSrc: "/rogerio1.png", 
        text: "Fiquei muito satisfeito pelo bom atendimento e pela qualidade do serviço prestado.",
    },
    {
        name: "Instituto Gil Nogueira",
        relation: "Cliente",
        avatarSrc: "/gil.png", 
        text: "Excelentes profissionais e serviço de qualidade!",
    },
    {
        name: "KAUSER gamer",
        relation: "Cliente",
        avatarSrc: "/kauser.png", 
        text: "Gostei de ver a estrutura. Bem espaçosa e moderna.",
    },
    {
        name: "Yaya Capoeira",
        relation: "Cliente",
        avatarSrc: "/yaya.png", 
        text: "Ótimo serviço e muita agilidade o atendimento.",
    },
    {
        name: "Eliane Silva Eliane Silva",
        relation: "Cliente",
        avatarSrc: "/eliane.png", 
        text: "Excelente empresa,responsáveis e atenciosos.",
    },
    {
        name: "Rogerio Costa",
        relation: "Cliente",
        avatarSrc: "/rogerio2.png", 
        text: "Excelência em trabalhos gráficos",
    },
    {
        name: "BRUNO BRUCCE",
        relation: "Cliente",
        avatarSrc: "/bruno.png", 
        text: "Gráfica de qualidade em BH.",
    },
    {
        name: "Uriel Barony",
        relation: "Cliente",
        avatarSrc: "/uriel.png", 
        text: "Excelente produto de bom preço.",
    },
    {
        name: "Carina Santos",
        relation: "Cliente",
        avatarSrc: "/carina.png", 
        text: "Ótima em tudo.",
    },
    {
        name: "Will Bordados",
        relation: "Cliente",
        avatarSrc: "/will.png", 
        text: "Atendimento bakana.",
    },
    {
        name: "Rogerio Alves",
        relation: "Cliente",
        avatarSrc: "/rogerio3.png", 
        text: "Principal!",
    }
  ];

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Título */}
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 drop-shadow-sm flex flex-col items-center justify-center gap-2">
            <span>Nossas Avaliações</span>
            <div className="w-24 h-1 bg-yellow-500 rounded-full mt-2"></div>
            </h2>
        </div>

        {/* --- DESTAQUE (REVIEW LONGO) --- */}
        <div className="mb-12 bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border-l-8 border-yellow-500">
            <Quote className="absolute top-4 right-8 text-slate-800 w-32 h-32 -rotate-12 opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    {/* Cabeçalho do Destaque */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Award className="text-yellow-500 w-6 h-6" />
                            <span className="text-yellow-500 font-bold tracking-wider text-sm uppercase">Destaque</span>
                        </div>
                        {/* Estrelas */}
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} fill="currentColor" stroke="none" />
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg italic leading-relaxed md:text-xl mb-8 whitespace-pre-line">
                        "{featuredReview.text}"
                    </p>

                    {/* Rodapé do Destaque com FOTO */}
                    <div className="mt-6 pt-6 border-t border-slate-700 flex items-center gap-4">
                        {/* Avatar Destaque (Maior e com borda amarela) */}
                        <Image 
                            src={featuredReview.avatarSrc}
                            alt={featuredReview.name}
                            width={64}
                            height={64}
                            className="rounded-full object-cover border-2 border-yellow-500 shadow-sm"
                        />
                        <div>
                            <p className="font-bold text-white text-lg md:text-xl leading-tight">{featuredReview.name}</p>
                            <p className="text-yellow-500 font-medium text-sm md:text-base">{featuredReview.relation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- GRID (REVIEWS NORMAIS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedReviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-slate-50 p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col"
            >
              <div className="absolute -top-4 -left-2 bg-white p-2 rounded-full shadow-md border border-slate-100">
                <Quote className="text-yellow-500 w-6 h-6 fill-yellow-500" />
              </div>

              <div className="flex text-yellow-400 mb-4 ml-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" stroke="none" />
                ))}
              </div>

              <p className="text-slate-600 italic mb-6 leading-relaxed flex-grow">
                "{review.text}"
              </p>

              {/* Rodapé do Card Normal com FOTO */}
              <div className="border-t border-slate-200 pt-4 mt-auto flex items-center gap-3">
                {/* Avatar Normal (Tamanho padrão 48px) */}
                <Image 
                    src={review.avatarSrc}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border border-slate-300 shadow-sm"
                />
                <div>
                    <span className="font-bold text-slate-900 text-md block leading-tight">{review.name}</span>
                    <span className="text-xs text-yellow-600 font-semibold uppercase tracking-wide block">
                        {review.relation}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Ver Mais */}
        <div className="mt-12 flex justify-center">
            <button 
                onClick={() => setShowAll(!showAll)}
                className="group flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-full shadow-md hover:bg-yellow-500 hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
            >
                {showAll ? (
                    <>Ver menos avaliações <ChevronUp className="w-5 h-5" /></>
                ) : (
                    <>Ver mais avaliações <ChevronDown className="w-5 h-5" /></>
                )}
            </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;