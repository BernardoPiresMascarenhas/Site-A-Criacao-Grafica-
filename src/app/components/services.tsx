"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import Modal from "./modal";
import ServiceCard from "./ServiceCard";
// Removemos a importação estática do servicesData, pois agora é tudo dinâmico!

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.4 },
  },
};

// Adaptamos o tipo para aceitar o E-commerce, sem quebrar o Modal antigo
export interface ServiceEcommerce {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  precoBase: number;
  variacoes?: any[];      // <-- NOVO: Recebe as opções
  portfolioItems?: any[]; // <-- NOVO: Recebe a galeria
}

const Services = () => {
  const [produtos, setProdutos] = useState<ServiceEcommerce[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceEcommerce | null>(null);
  const [carregando, setCarregando] = useState(true);

  // A MÁGICA DE BUSCAR NO BANCO DE DADOS
  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        const resposta = await fetch("http://localhost:3333/produtos");
        if (resposta.ok) {
          const dadosDoBanco = await resposta.json();
          
          const vitrineFormatada = dadosDoBanco.map((produto: any) => {
            
            // 1. Monta a galeria de fotos do Modal
            const galeria = [];
            if (produto.imagemUrl) {
              galeria.push({ id: 'capa', image: encodeURI(produto.imagemUrl), title: produto.nome }); // encodeURI resolve problemas com espaços no nome da foto!
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
              precoBase: produto.precoBase,
              variacoes: produto.variacoes || [], // Passa as opções para o Modal!
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

        {carregando ? (
          <div className="text-center py-10 text-xl font-bold text-gray-400 animate-pulse">
            Carregando catálogo...
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true }} 
          >
            {produtos.map((service) => (
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
          service={selectedService as any} // Faz um cast para evitar erro no TypeScript do Modal
          closeModal={closeModal}
        />
      )}
    </section>
  );
};

export default Services;