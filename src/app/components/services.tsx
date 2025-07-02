
import React, { useState } from "react";
import Modal from "./modal";
import ServiceCard from "./ServiceCard";


const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    wpplink: string;
    img: string;
    directToCatalog?: boolean; 
  } | null>(null);

  const openModal = (title: string, description: string, wpplink: string, img: string, directToCatalog?: boolean) => {
    
    setModalContent({ title, description, wpplink, img, directToCatalog });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div id="services" className="py-20 bg-gradient-to-br from-white via-yellow-100 to-yellow-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#262A2B] mb-10 drop-shadow flex items-center justify-center gap-2">
          <span>Nossos Serviços</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <ServiceCard
            title="Consultas"
            description="Atendimento personalizado para diagnósticos precisos e tratamentos eficazes."
            openModal={openModal}
            wpplink="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta."
            img="/dog1.png"
          />
          <ServiceCard
            title="Banho e Tosa"
            description="Cuidados estéticos e higiênicos para deixar seu pet sempre bonito e confortável."
            openModal={openModal}
            wpplink="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20Banho%20e%20Tosa."
            img="/cat1.png"
          />
          <ServiceCard
            title="Vacinação"
            description="Proteção completa para prevenir doenças e manter seu pet saudável."
            openModal={openModal}
            wpplink="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20a%20Vacinação."
            img="/dog2.png"
          />
          <ServiceCard
            title="Cirurgia"
            description="Procedimentos seguros com profissionais experientes e cuidadosos."
            openModal={openModal}
            wpplink="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20os%20Procedimentos%20Cirúrgicos."
            img="/cat3.png"
          />
          {/* MUDANÇA: Adicionado directToCatalog={true} abaixo */}
          <ServiceCard
            title="Pet Shop"
            description="Produtos e acessórios para seu pet com muito amor e qualidade."
            openModal={openModal}
            wpplink="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20os%20Produtos%20e%20Acessórios."
            img="/cat2.png"
            directToCatalog={true}
          />
          {/* MUDANÇA: Adicionado directToCatalog={true} abaixo */}
          <ServiceCard
            title="Farmácia Pet"
            description="Medicamentos e suplementos de qualidade para o bem-estar do seu bichinho."
            openModal={openModal}
            wpplink="https://wa.me/553195306014?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20a%20Farmácia%20Pet."
            img="/cat4.png"
            directToCatalog={true}
          />
        </div>
      </div>

      {isModalOpen && modalContent && (
        <Modal
          title={modalContent.title}
          description={modalContent.description}
          wpplink={modalContent.wpplink}
          img={modalContent.img}
          closeModal={closeModal}
          // MUDANÇA: Passando a nova propriedade para o Modal
          directToCatalog={modalContent.directToCatalog}
        />
      )}
    </div>
  );
};

export default Services;