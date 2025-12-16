"use client";

import React from 'react';
import Image from 'next/image';
import { partnersData } from '@/data/partnersData'; 


import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const Partners = () => {
  return (
    <section id="cliente" className="py-16" style={{ backgroundColor: '#f4f4fc' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        
        <Swiper
          modules={[Autoplay, FreeMode]}
          loop={true} 
          freeMode={true} 
          grabCursor={true} 
          
          
          autoplay={{
            delay: 1, 
            disableOnInteraction: false, 
          }}
          
          
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 30 },
            640: { slidesPerView: 3, spaceBetween: 40 },
            768: { slidesPerView: 4, spaceBetween: 50 },
            1024: { slidesPerView: 5, spaceBetween: 60 },
          }}
          
          
          speed={3000} 
          className="py-4"
        >
          {partnersData.map((partner) => (
            <SwiperSlide key={partner.id} className="flex justify-center items-center">
              <div className="relative h-40 w-48">
                <Image
                  src={partner.logo}
                  alt={`Logo da ${partner.name}`}
                  layout="fill"
                  objectFit="contain"
                  className="grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Partners;