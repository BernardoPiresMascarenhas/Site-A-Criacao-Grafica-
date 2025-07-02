"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import Header from "./components/header";
import Hero from "./components/hero";
import Services from "./components/services";
import AboutUs from "./components/about";
import Gallery from "./components/gallery";
import Image from 'next/image';

import FormularioContato from "@/app/components/FormularioContato";
import PromoModal from "./components/PromoModal"; 

function App() {
  const [showPromo, setShowPromo] = useState(false);       
  const [minimized, setMinimized] = useState(false);       

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromo(true); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promo Modal */}
      {showPromo && (
        <PromoModal
          onClose={() => {
            setShowPromo(false);
            setMinimized(true);
          }}
          onWhatsApp={() => {
            window.open("https://wa.me/553195306014?text=Olá,%20quero%20ver%20as%20promoções!", "_blank");
            setShowPromo(false);
            setMinimized(true);
          }}
        />
      )}

      {/* Botão flutuante para reabrir o modal */}
      {minimized && !showPromo && (
        <button
          onClick={() => {
          setShowPromo(true);
          setMinimized(false);
          }}
          className="fixed bottom-4 left-8 p-2 rounded-full hover:scale-110 transition-transform duration-300 z-50 sm:left-8 sm:p-2 md:left-8 md:p-2 xs:left-4 xs:p-1" // 'xs' aqui é só um exemplo, veja abaixo como fazer
        >
          <Image
            src="/promo-icon.png"
            alt="Promoção"
            width={48} 
            height={48}
            className="w-14 h-14 sm:w-20 sm:h-20 animate-bounce"
          />
        </button>
      )}

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* About Section */}
      <AboutUs />

      {/* Gallery Section */}
      <Gallery />

     {/* Contact Section */}
      <div id="contact" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900">
                Entre em Contato
              </h2>
            <div className="mt-8 space-y-6">
              <ContactInfo
                icon={<MapPin />}
                text="Rua Itapetinga, 128 Cachoeirinha . Belo Horizonte"
              />
              <ContactInfo icon={<Phone />} text="(31) 2555-2560" />
              <ContactInfo icon={<Clock />} text="Seg-Sex: 8h às 18h" />
            </div>
          </div>
      <div className="mt-10 lg:mt-0 lg:w-1/2">
        <p className="text-gray-600 mb-6 text-base leading-relaxed">
          Tem alguma dúvida ou quer agendar um horário? Preencha os campos abaixo e nossa equipe entrará em contato o mais breve possível.
        </p>
        <FormularioContato />
      </div>
    </div>
  </div>
</div>

      {/* Botão flutuante do WhatsApp */}
      <a
        href="https://wa.me/553125552560?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={48}  
          height={48}
        />
      </a>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Império dos Pets" 
                width={250} 
                height={250} 
                priority 
              />
            </div>
            <div className="mt-4 md:mt-0">
              <p>&copy; 2025 A Criação Gráfica. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactInfo({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center">
      <div className="text-yellow-300">{icon}</div>
      <span className="ml-3 text-gray-600">{text}</span>
    </div>
  );
}

export default App;
