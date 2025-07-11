"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from '@phosphor-icons/react';
import { Service } from '@/data/servicesData';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-30"
          aria-label="Fechar modal"
        >
          <X size={28} />
        </button>
        
        <div className="relative w-full h-80 sm:h-96 bg-gray-100 rounded-t-3xl p-8">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, A11y]}
            loop={true}
            effect="fade"
            pagination={{ clickable: true }}
            className="w-full h-full"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            navigation={{
              nextEl: '.modal-swiper-button-next',
              prevEl: '.modal-swiper-button-prev',
            }}
          >
            {service.portfolioItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="modal-swiper-button-prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <div className="modal-swiper-button-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-900">
            {activePortfolioItem.title}
          </h3>
          <p className="mt-2 text-base text-gray-700 leading-relaxed">
            {activePortfolioItem.description}
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <a href={service.wpplink} target="_blank" rel="noopener noreferrer" className="block">
            <button className="w-full py-3 px-5 bg-yellow-400 text-[#262A2B] font-bold rounded-lg transition-transform duration-300 hover:scale-105">
              Solicitar um Orçamento
            </button>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;