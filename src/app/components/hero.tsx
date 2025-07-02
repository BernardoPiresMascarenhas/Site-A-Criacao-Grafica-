"use client";

import React from 'react';
import Image from "next/image";

// Importe os módulos e estilos do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';


const slidesData = [
  {
    image: '/hero1.png',
    title: 'Impressão Digital de Alta Qualidade',
    subtitle: 'Cartões, folders e flyers que impressionam na primeira vista.',
    buttonText: 'Solicitar Orçamento',
    buttonLink: '#orcamento',
  },
  {
    image: '/hero6.png',
    title: 'Comunicação Visual Sob Medida',
    subtitle: 'Crie banners, adesivos e placas que fortalecem sua marca.',
    buttonText: 'Conheça Nossos Serviços',
    buttonLink: '#services',
  },
  {
    image: '/hero5.png',
    title: 'Brindes Personalizados e Criativos',
    subtitle: 'Agendas, canecas e calendários que seus clientes vão amar.',
    buttonText: 'Ver Opções',
    buttonLink: '#produtos',
  },
];

const Hero = () => {
  // PASSO 2: Crie a função de rolagem aqui
  const scrollToSection = (sectionId) => {
    const id = sectionId.substring(1);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div id="home" className="relative w-full h-[75vh] text-white">
      <div className="relative w-full h-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.hero-swiper-button-next',
            prevEl: '.hero-swiper-button-prev',
          }}
          className="w-full h-full"
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="max-w-2xl px-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    {/* PASSO 3: Adicione o onClick ao botão */}
                    <button
                      onClick={() => scrollToSection(slide.buttonLink)}
                      className="mt-8 bg-yellow-400 text-[#262A2B] font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105"
                    >
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Seus botões de navegação customizados */}
        <div className="hero-swiper-button-prev">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div className="hero-swiper-button-next">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;