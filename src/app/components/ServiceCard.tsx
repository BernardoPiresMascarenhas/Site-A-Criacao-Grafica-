"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion"; 

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

interface ServiceCardProps {
  service: any; // Mudamos para any para aceitar a nossa nova versão com preço
  onCardClick: (service: any) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onCardClick }) => {
  return (
    <motion.div
      className="group cursor-pointer rounded-lg overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/60 flex flex-col"
      onClick={() => onCardClick(service)}
      variants={cardVariants} 
    >
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        <Image
          src={service.coverImage}
          alt={`Imagem de capa para ${service.title}`}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          unoptimized // <--- A MÁGICA ESTÁ AQUI!
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
        <p className="mt-2 text-sm text-gray-600 flex-1">{service.description}</p>
        
        {/* A ÁREA DO E-COMMERCE (PREÇO) */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end">
          <div>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">A partir de</span>
            <p className="text-2xl font-black text-[#262A2B]">
              R$ {service.precoBase?.toFixed(2).replace('.', ',')}
            </p>
          </div>
          
          <div className="text-yellow-500 font-bold group-hover:text-yellow-600 transition-colors">
              Detalhes →
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ServiceCard;