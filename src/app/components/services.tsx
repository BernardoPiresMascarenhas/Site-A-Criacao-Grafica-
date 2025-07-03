"use client";

import React, { useState } from "react";
import { motion } from "framer-motion"; 
import Modal from "./modal";
import ServiceCard from "./ServiceCard";
import { servicesData, Service } from '@/data/servicesData';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4, 
    },
  },
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openModal = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Nossos Serviços
            </h2>
            <p className="mt-4 text-lg text-gray-600">
                Soluções criativas em impressão para fortalecer a sua marca.
            </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true }} 
        >
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onCardClick={openModal}
            />
          ))}
        </motion.div>
      </div>

      {selectedService && (
        <Modal
          service={selectedService}
          closeModal={closeModal}
        />
      )}
    </section>
  );
};

export default Services;