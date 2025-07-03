"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion"; 
import { Service } from '@/data/servicesData';

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8, 
      ease: "easeOut" 
    },
  },
};

interface ServiceCardProps {
  service: Service;
  onCardClick: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onCardClick }) => {
  return (
    <motion.div
      className="group cursor-pointer rounded-lg overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/60"
      onClick={() => onCardClick(service)}
      variants={cardVariants} 
    >
      <div className="relative w-full h-48">
        <Image
          src={service.coverImage}
          alt={`Imagem de capa para ${service.title}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{service.description}</p>
        <div className="mt-4 text-yellow-500 font-semibold group-hover:text-yellow-600 transition-colors">
            Ver portfólio →
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;