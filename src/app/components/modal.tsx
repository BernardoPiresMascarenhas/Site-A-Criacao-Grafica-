"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, WhatsappLogo } from '@phosphor-icons/react';
import { Service } from '@/data/servicesData';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import OrcamentoForm from '../components/OrcamentoForm';

import { motion } from 'framer-motion';


interface ModalProps {
  service: Service;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ service, closeModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!service.portfolioItems || service.portfolioItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={closeModal}>
        <div className="bg-white p-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
          <p>Nenhum item de portfólio encontrado para este serviço.</p>
        </div>
      </div>
    );
  }

  const activePortfolioItem = service.portfolioItems[activeIndex];

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        // A rolagem no mobile volta para o container principal
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row h-auto max-h-[85vh] md:h-[50vh] overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== MUDANÇA PRINCIPAL ===== */}
        {/* 1. O BOTÃO FOI MOVIDO PARA CIMA */}
        {/* 2. USA 'sticky' no mobile e 'absolute' no desktop */}
        <button
          onClick={closeModal}
          className="sticky md:absolute top-4 right-4 self-end mr-2 mt-2 md:mt-0 md:mr-0 text-slate-600 bg-white/50 hover:text-slate-900 hover:bg-white transition-all duration-300 z-30 rounded-full p-1.5 backdrop-blur-sm"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>

        {/* Coluna da Imagem (Esquerda) */}
        <div className="relative w-full md:w-1/2 h-64 md:h-full flex-shrink-0 bg-slate-100">
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            loop={true}
            pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
            navigation={{
              nextEl: '.modal-swiper-button-next',
              prevEl: '.modal-swiper-button-prev',
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {service.portfolioItems.map((item) => (
              <SwiperSlide key={item.id}>
                {/* Ajustei o padding para dar um pequeno respiro, mas pode remover se quiser */}
                <div className="w-full h-full flex items-center justify-center p-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <button className="modal-swiper-button-prev absolute top-1/2 left-3 -translate-y-1/2 z-10 bg-white/50 p-2 rounded-full hover:bg-white transition-all duration-300 backdrop-blur-sm hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className="modal-swiper-button-next absolute top-1/2 right-3 -translate-y-1/2 z-10 bg-white/50 p-2 rounded-full hover:bg-white transition-all duration-300 backdrop-blur-sm hidden md:block">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div className="swiper-pagination-custom"></div>
        </div>

        {/* Coluna de Conteúdo (Direita) */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="p-6 md:p-8 flex-grow overflow-y-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-800">
              {activePortfolioItem.title}
            </h3>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {activePortfolioItem.description}
            </p>
            
            {service.calculator && (
              <OrcamentoForm calculator={service.calculator} />
            )}
          </div>
          
          <div className="p-6 md:p-8 border-t border-slate-200 bg-slate-50">
            <a href={service.wpplink} target="_blank" rel="noopener noreferrer" className="block">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-5 bg-yellow-400 text-slate-900 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-yellow-500"
              >
                <WhatsappLogo size={20} weight="fill" />
                Solicitar um Orçamento
              </motion.button>
            </a>
          </div>
        </div>

        {/* O botão X foi movido para o topo do motion.div */}

      </motion.div>
    </div>
  );
};

export default Modal;