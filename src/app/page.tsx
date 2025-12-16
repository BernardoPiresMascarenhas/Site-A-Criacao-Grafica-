"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import Header from "./components/header";
import Hero from "./components/hero";
import Services from "./components/services";
import AboutUs from "./components/about";
import InstagramFeed from "./components/SocialFeed";
import Testimonials from "./components/Testimonials";

import Image from 'next/image';
import Partners from './components/Partners';

import FormularioContato from "@/app/components/FormularioContato";
import PromoModal from "./components/PromoModal"; 
import { InstagramLogo, WhatsappLogo, FacebookLogo } from "@phosphor-icons/react";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 112; 
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        
    };


function App() {
  const [showPromo, setShowPromo] = useState(false);       
  const [minimized, setMinimized] = useState(false);       

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromo(true); 
    }, 7000);

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

    {/* Container Flexbox para alinhar os botões flutuantes */}
    <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between p-4 pointer-events-none">

      {/* Wrapper para o botão do modal (para controlar os eventos do ponteiro) */}
      <div className="pointer-events-auto">
        {/* Botão flutuante para reabrir o modal */}
        {minimized && !showPromo && (
          <button
            onClick={() => {
              setShowPromo(true);
              setMinimized(false);
            }}
            className="p-2 transition-transform duration-300 rounded-full hover:scale-110"
          >
            <Image
              src="/promo.png"
              alt="Promoção"
              width={48}
              height={48}
              className="w-14 h-14 sm:w-20 sm:h-20"
            />
          </button>
        )}
      </div>

      {/* Botão flutuante do WhatsApp */}
      <a
        href="https://wa.me/5531987090217?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 transition-transform duration-300 ease-in-out bg-green-500 rounded-full shadow-lg pointer-events-auto hover:bg-green-600 hover:scale-110"
      >
        <Image
          src="/whatsapp.png"
          alt="WhatsApp"
          width={48}
          height={48}
        />
      </a>
    </div>

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <AboutUs />
      
      {/* Services Section */}
      <Services />

      <InstagramFeed />
      <Testimonials />
      <Partners />


     {/* Seção de Contato */}
<div id="contact" className="bg-gray-50 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
      {/* Coluna da Esquerda: Informações e Mapa */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Entre em Contato
          </h2>

          {/* NOVO BLOCO DO MAPA */}
          <div className="mt-10 h-80 w-full overflow-hidden rounded-lg shadow-xl">
            <iframe
              className="h-full w-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.053359398571!2d-43.93738878508616!3d-19.87991978663186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa69b76a5b634cb%3A0x34346808794833a6!2sR.%20Itapetinga%2C%20128%20-%20Cachoeirinha%2C%20Belo%20Horizonte%20-%20MG%2C%2031130-510%2C%20Brasil!5e0!3m2!1spt-BR!2sus!4v1694034859283!5m2!1spt-BR!2sus"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Gráfica a Criação no Google Maps"
            ></iframe>
          </div>
          
          {/* FIM DO BLOCO DO MAPA */}

          <div className="mt-8 space-y-6">
            <ContactInfo
              icon={<MapPin />}
              text="Rua Itapetinga, 128 - Cachoeirinha, Belo Horizonte, Brasil"
            />
            <ContactInfo icon={<Phone />} text="Local: (31) 2555-2560  | WhatsApp: 31 98709-0217" />
            <ContactInfo icon={<Clock />} text="Seg-Sex: 8h às 18h" />
          </div>
        </div>
      </div>

      {/* Coluna da Direita: Formulário */}
      <div className="mt-10 lg:mt-0">
        <p className="text-gray-600 mb-6 text-base leading-relaxed">
          Tem alguma dúvida ou quer solicitar algum serviço? Preencha os campos abaixo e nossa equipe entrará em contato o mais breve possível.
        </p>
        <FormularioContato />
      </div>
    </div>
  </div>
</div>


      {/* Footer */}
<footer className="bg-gray-900 text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      
      {/* Coluna 1: Logo e Descrição */}
      <div className="flex flex-col items-center md:items-start">
        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="mb-4">
          <Image 
            src="/logo.png" 
            alt="A Criação Gráfica" 
            width={200}
            height={200}
            priority 
            className="invert brightness-0"
          />
        </a>
        <p className="text-sm max-w-xs">
          Soluções criativas em impressão e comunicação visual para fortalecer a sua marca.
        </p>
      </div>

      {/* Coluna 2: Links de Navegação */}
      <div>
        <h3 className="text-lg font-semibold text-white tracking-wider uppercase mb-4">
          Navegação
        </h3>
        <ul className="space-y-2">
          <li><a href="#home" onClick={(e) => scrollToSection(e, "home")} className="hover:text-yellow-400 transition-colors">Home</a></li>
          <li><a href="#about" onClick={(e) => scrollToSection(e, "about")} className="hover:text-yellow-400 transition-colors">Sobre</a></li>
          <li><a href="#services" onClick={(e) => scrollToSection(e, "services")} className="hover:text-yellow-400 transition-colors">Serviços</a></li>
          <li><a href="#social-feed" onClick={(e) => scrollToSection(e, "social-feed")} className="hover:text-yellow-400 transition-colors">Feed</a></li>
          <li><a href="#testimonials" onClick={(e) => scrollToSection(e, "testimonials")} className="hover:text-yellow-400 transition-colors">Avaliações</a></li>
          <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="hover:text-yellow-400 transition-colors">Contato</a></li>
        </ul>
      </div>

      {/* Coluna 3: Contato e Redes Sociais */}
      <div>
        <h3 className="text-lg font-semibold text-white tracking-wider uppercase mb-4">
          Contato
        </h3>
        <ul className="space-y-2">
          <li><p>Rua Itapetinga, 128 Cachoeirinha . Belo Horizonte</p></li>
          <li><a href="mailto:orcamento@acriação.com.br" className="hover:text-yellow-400 transition-colors">orcamento@acriação.com.br</a></li>
          <li><a href="tel:+553125552560" className="hover:text-yellow-400 transition-colors">(31) 2555-2560</a></li>
        </ul>
        
        {/* ÍCONES REAIS INSERIDOS AQUI */}
        <div className="flex justify-center md:justify-start space-x-4 mt-6">
            <a href="https://www.instagram.com/acriacaografic/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-[#262A2B] rounded-full transition-transform duration-300 transform hover:scale-110">
                <InstagramLogo className="w-6 h-6 text-yellow-400" />
            </a>
            <a href="https://api.whatsapp.com/send?phone=5531987090217&text=Oi%20estava%20no%20site!%20gostaria%20de%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-[#262A2B] rounded-full transition-transform duration-300 transform hover:scale-110">
                <WhatsappLogo className="w-6 h-6 text-yellow-400" />
            </a>
            <a href="https://www.facebook.com/acriacaografic/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-[#262A2B] rounded-full transition-transform duration-300 transform hover:scale-110">
                <FacebookLogo className="w-6 h-6 text-yellow-400" />
            </a>
        </div>
      </div>
    </div>

    {/* Sub-rodapé com Copyright */}
    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} A Criação Gráfica. Todos os direitos reservados.</p>
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
