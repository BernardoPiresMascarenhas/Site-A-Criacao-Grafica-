"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";

const Gallery = () => {
  return (
    <section id="gallery" className="pt-12 pb-8 bg-gradient-to-br from-white via-yellow-100 to-yellow-200">
  <div className="max-w-6xl mx-auto px-4">
    <motion.h2
      className="text-4xl font-extrabold text-purple-700 mb-4 text-center"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      viewport={{ once: true }}
    >
      O Carinho Que Seu Pet Merece
    </motion.h2>

    <Swiper
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      pagination={{
        clickable: true,
        el: ".custom-pagination",
      }}
      slidesPerView={1}
      className="gallery-swiper"
    >
      {["galeria.png", "galeria.png"].map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={`/${img}`}
              alt={`Imagem ${idx + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </SwiperSlide>
      ))}

      <div className="swiper-button-prev !text-black"></div>
      <div className="swiper-button-next !text-black"></div>
    </Swiper>

    {/* Paginação bem próxima à imagem */}
        <div className="custom-pagination mt-2 flex justify-center"></div>
     </div>
    </section>
  );
};

export default Gallery;
