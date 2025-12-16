"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, WhatsappLogo, CaretLeft, CaretRight, Calculator, Image as ImageIcon } from '@phosphor-icons/react';
import { Service } from '@/data/servicesData';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import OrcamentoForm from '../components/OrcamentoForm';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  service: Service;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ service, closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!service.portfolioItems || service.portfolioItems.length === 0) return null;

  const activePortfolioItem = service.portfolioItems[activeIndex];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      >
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          // Ajuste de Altura e Bordas:
          // Mobile: rounded-t-2xl (arredondado só em cima), h-[90vh] (ocupa quase tudo, mas deixa ver o fundo)
          // Desktop: rounded-2xl (tudo arredondado), h-[80vh]
          className="relative bg-white w-full max-w-5xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* BOTÃO FECHAR 
             - Mobile: Escuro (pois o fundo é claro), fixo no topo direito do card.
             - Desktop: Branco (pois o fundo é escuro), flutuante.
          */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2 rounded-full transition-colors backdrop-blur-md
                       text-slate-600 bg-white/60 hover:bg-slate-200 
                       md:text-white md:bg-white/10 md:hover:bg-slate-100/20"
          >
            <X size={24} weight="bold" />
          </button>

          {/* ================= COLUNA ESQUERDA (IMAGENS) ================= */}
          {/* MUDANÇA AQUI:
              - Mobile: h-64 (altura fixa, não muito grande), bg-slate-50 (cinza bem clarinho)
              - Desktop: h-full, bg-slate-900 (azul escuro elegante)
          */}
          <div className="relative w-full md:w-5/12 h-64 md:h-full bg-slate-50 md:bg-slate-900 flex flex-col justify-center flex-shrink-0 border-b md:border-b-0 border-slate-100">
            
            <Swiper
              modules={[Navigation, Pagination, A11y, Autoplay]}
              loop={true}
              spaceBetween={0}
              slidesPerView={1}
              className="w-full h-full"
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              navigation={{
                nextEl: '.custom-next',
                prevEl: '.custom-prev',
              }}
              pagination={{ 
                clickable: true,
                // Mobile: bullets cinzas escuros | Desktop: bullets brancos
                bulletActiveClass: '!bg-yellow-400 opacity-100',
                bulletClass: 'swiper-pagination-bullet !bg-slate-300 md:!bg-white/50 !opacity-100'
              }}
            >
              {service.portfolioItems.map((item) => (
                <SwiperSlide key={item.id} className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-full h-full p-6 md:p-12">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain drop-shadow-md md:drop-shadow-2xl"
                    />
                  </div>
                  
                  {/* Legenda: Só aparece no Desktop para economizar espaço no mobile */}
                  <div className="hidden md:block absolute bottom-8 left-0 right-0 text-center px-4">
                    <span className="inline-block bg-black/60 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full border border-white/10">
                      {item.title}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Setas de navegação (Apenas Desktop) */}
            <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-yellow-400 transition-colors hidden md:block">
              <CaretLeft size={32} weight="bold" />
            </button>
            <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-yellow-400 transition-colors hidden md:block">
              <CaretRight size={32} weight="bold" />
            </button>
          </div>

          {/* ================= COLUNA DIREITA (CONTEÚDO) ================= */}
          <div className="flex-1 flex flex-col min-h-0 bg-white relative">
            
            {/* Header do Conteúdo */}
            <div className="px-6 py-4 md:p-8 border-b border-slate-100 bg-white z-10">
              <div className="flex items-center gap-2 text-yellow-600 md:text-yellow-500 mb-1 font-semibold text-xs md:text-sm uppercase tracking-wider">
                 <ImageIcon size={16} />
                 <span>Detalhes</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">
                {service.title}
              </h2>
            </div>

            {/* Corpo com Scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-4 md:p-8 space-y-6 md:space-y-8 scroll-smooth pb-24 md:pb-8">
              
              {/* Descrição */}
              <div>
                {/* No mobile, mostramos o título da variante selecionada aqui, já que tiramos da imagem */}
                <h3 className="md:hidden text-md font-bold text-slate-900 mb-2">
                  {activePortfolioItem.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {activePortfolioItem.description || service.description}
                </p>
              </div>

              {/* Calculadora */}
              {service.calculator && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Calculator size={20} className="text-blue-600" weight="duotone" />
                    <h3 className="font-bold text-base md:text-lg">Simular Orçamento</h3>
                  </div>
                  
                  <OrcamentoForm calculator={service.calculator} />
                </div>
              )}
            </div>

            {/* Footer Fixo (Botão WhatsApp) */}
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-20 md:relative absolute bottom-0 w-full">
              <a 
                href={service.wpplink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full"
              >
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 bg-[#25D366] active:bg-[#1da851] text-white font-bold text-base md:text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <WhatsappLogo size={24} weight="fill" />
                  <span>Pedir no WhatsApp</span>
                </motion.button>
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;