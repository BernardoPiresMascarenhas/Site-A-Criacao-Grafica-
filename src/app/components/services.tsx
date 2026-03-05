"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import Modal from "./modal";
import ServiceCard from "./ServiceCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.4 },
  },
};

export interface ServiceEcommerce {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  precoBase: number;
  variacoes?: any[];      
  portfolioItems?: any[]; 
}

const Services = () => {
  const [produtos, setProdutos] = useState<ServiceEcommerce[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceEcommerce | null>(null);
  const [carregando, setCarregando] = useState(true);

  // CORREÇÃO 1: Os estados precisam ficar AQUI DENTRO do componente!
  const [termoBusca, setTermoBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("relevantes"); 

  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        const resposta = await fetch("http://localhost:3333/produtos");
        if (resposta.ok) {
          const dadosDoBanco = await resposta.json();
          
          const vitrineFormatada = dadosDoBanco.map((produto: any) => {
            const galeria = [];
            if (produto.imagemUrl) {
              galeria.push({ id: 'capa', image: encodeURI(produto.imagemUrl), title: produto.nome }); 
            }
            if (produto.imagens && produto.imagens.length > 0) {
              produto.imagens.forEach((img: any) => {
                galeria.push({ id: img.id, image: encodeURI(img.url), title: produto.nome });
              });
            }

            return {
              id: produto.id,
              title: produto.nome,
              description: produto.descricao || "Impressão de alta qualidade.",
              coverImage: produto.imagemUrl ? encodeURI(produto.imagemUrl) : "/logo.png", 
              precoBase: produto.tipoPrecificacao === 'PACOTE' && produto.pacotes && produto.pacotes.length > 0 
                ? Math.min(...produto.pacotes.map((p: any) => p.preco)) 
                : produto.precoBase,
              variacoes: produto.variacoes || [], 
              tipoPrecificacao: produto.tipoPrecificacao,
              pacotes: produto.pacotes || [],
              portfolioItems: galeria.length > 0 ? galeria : null
            };
          });

          setProdutos(vitrineFormatada);
        }
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarVitrine();
  }, []);

  const openModal = (service: ServiceEcommerce) => setSelectedService(service);
  const closeModal = () => setSelectedService(null);

  // 1. Filtra e 2. Ordena os produtos para o cliente
  const produtosExibidos = produtos
    .filter((produto) => {
      // Se a barra estiver vazia (ignorando espaços), mostra todos os produtos
      if (termoBusca.trim() === "") return true;
      return produto.title.toLowerCase().includes(termoBusca.trim().toLowerCase());
    })
    .sort((a, b) => {
      if (ordenacao === "menor-preco") return a.precoBase - b.precoBase;
      if (ordenacao === "maior-preco") return b.precoBase - a.precoBase;
      if (ordenacao === "a-z") return a.title.localeCompare(b.title);
      return 0; 
    });

  return (
    <section id="services" className="py-20 bg-gray-50 bg-[url('/header-background.png')] bg-repeat bg-[size:400px_auto]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Nossos Serviços
            </h2>
            <p className="mt-4 text-lg text-gray-600">
                Soluções criativas em impressão para fortalecer a sua marca. Faça seu orçamento online!
            </p>
        </div>

        {/* BARRA DE PESQUISA E FILTROS DO CLIENTE */}
        <div className="max-w-6xl mx-auto mb-10 px-4">
          <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-3 items-center">
            
            <div className="flex-1 w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input 
                type="text" 
                placeholder="O que você precisa imprimir hoje? (ex: Cartão, Banner...)" 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-[#262A2B] text-lg"
              />
            </div>

            <div className="w-full md:w-56 shrink-0">
              <select 
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="w-full px-4 py-4 bg-[#262A2B] text-white border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold cursor-pointer appearance-none text-center hover:bg-yellow-400 hover:text-[#262A2B]"
              >
                <option value="relevantes">🔥 Mais Relevantes</option>
                <option value="menor-preco">💲 Menor Preço</option>
                <option value="maior-preco">💎 Maior Preço</option>
                <option value="a-z">🔤 Ordem A-Z</option>
              </select>
            </div>

          </div>
        </div>

        {carregando ? (
          <div className="text-center py-10 text-xl font-bold text-gray-400 animate-pulse">
            Carregando catálogo...
          </div>
        ) : produtosExibidos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 font-bold">Nenhum produto encontrado para "{termoBusca}"</p>
            <button 
              onClick={() => setTermoBusca("")} 
              className="mt-4 text-yellow-600 hover:underline font-bold"
            >
              Limpar pesquisa
            </button>
          </div>
        ) : (
          <motion.div
            key={termoBusca}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true }} 
          >
            {/* CORREÇÃO 3: Aqui o map usa produtosExibidos em vez de produtos */}
            {produtosExibidos.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onCardClick={openModal}
              />
            ))}
          </motion.div>
        )}
      </div>

      {selectedService && (
        <Modal
          service={selectedService as any} 
          closeModal={closeModal}
        />
      )}
    </section>
  );
};

export default Services;