
import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  wpplink: string;
  img: string;
  openModal: (title: string, description: string, wpplink: string, img: string, directToCatalog?: boolean) => void;
  directToCatalog?: boolean; // MUDANÇA: Adicionada nova prop opcional
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  openModal,
  wpplink,
  img,
  directToCatalog, // MUDANÇA: Recebendo a nova prop
}) => {
  return (
    <div
      className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-transparent hover:border-purple-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
      // MUDANÇA: Passando a prop para a função openModal
      onClick={() => openModal(title, description, wpplink, img, directToCatalog)}
    >
      
      <h3 className="text-xl font-bold text-purple-800 mb-2">{title}</h3>
      <p className="text-gray-600">Clique para saber mais!</p>
    </div>
  );
};

export default ServiceCard;