"use client";

import React from 'react';
import Image from "next/image";
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slidesData = [
  {
    image: '/hero6.png',
    title: 'Quer uma gráfica em BH?',
    subtitle: 'A Criação gráfica está pronta para oferecer soluções personalizadas e eficientes para o seu negócio!',
    buttonText: 'Sobre Nós',
    buttonLink: '#about',
  },
  {
    image: '/hero5.png',
    title: 'Brindes Personalizados e Criativos',
    subtitle: 'Agendas, canecas e calendários que seus clientes vão amar.',
    buttonText: 'Ver Opções',
    buttonLink: '#services',
  },
  {
    image: '/hero4.png',
    title: 'Comunicação Visual Sob Medida',
    subtitle: 'Crie banners, adesivos e placas que fortalecem sua marca.',
    buttonText: 'Conheça Nossos Serviços',
    buttonLink: '#services',
  },
];

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.5 },
  },
};

const textItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" }},
};


const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const id = sectionId.substring(1);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="home" className="relative w-full h-[87vh] text-white">
      <div className="relative w-full h-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          loop={true}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
             nextEl: '.hero-swiper-button-next',
             prevEl: '.hero-swiper-button-prev',
          }}
          className="w-full h-full"
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                    priority={index === 0} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <motion.div
                      className="max-w-3xl px-4" 
                      variants={textContainerVariants}
                      initial="hidden"
                      animate={isActive ? "visible" : "hidden"} 
                    >
                      <motion.h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold drop-shadow-lg"
                        variants={textItemVariants}
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.p
                        className="mt-4 text-xl sm:text-2xl drop-shadow-md"
                        variants={textItemVariants}
                      >
                        {slide.subtitle}
                      </motion.p>
                      
                      <motion.div variants={textItemVariants}>
                        <button
                          onClick={() => scrollToSection(slide.buttonLink)}
                          className="mt-8 bg-yellow-400 text-[#262A2B] font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105"
                        >
                          {slide.buttonText}
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

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