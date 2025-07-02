"use client";

import { useState } from 'react'; // 1. Importar o useState
import { InstagramLogo, FacebookLogo, WhatsappLogo, List, X } from "@phosphor-icons/react"; 
import Image from "next/image";

const Header = () => {
    // 3. Adicionar estado para controlar a visibilidade do menu mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 112; // Altura do seu header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        // Fecha o menu mobile após clicar em um link
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        // A tag <nav> se torna o container relativo para o menu mobile absoluto
        <nav className="bg-[url('/header-background.png')] bg-cover bg-no-repeat bg-center shadow-sm sticky top-0 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-36 items-center">
                    <div className="flex items-center">
                        {/* Logo */}
                        <a
                            href="#home"
                            onClick={(e) => scrollToSection(e, "home")}
                            className="text-gray-700 hover:text-purple-600"
                        >
                            <Image
                                src="/logo.png"
                                alt="Logo Império do Pets"
                                width={350}
                                height={350}
                                className="transition-transform duration-300 ease-in-out hover:scale-110"
                            />
                        </a>
                    </div>

                    {/* Links do Menu Desktop - Escondido em telas menores (md) */}
                    <div className="hidden md:flex items-center space-x-8 text-lg font-semibold">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700 hover:text-[#ECE537]">Home</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700 hover:text-[#ECE537]">Serviços</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-gray-700 hover:text-[#ECE537]">Sobre</a>
                        <a href="#gallery" onClick={(e) => scrollToSection(e, "gallery")} className="text-gray-600 hover:text-[#ECE537] transition-colors">Galeria</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-700 hover:text-[#ECE537]">Contato</a>
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

                    {/* 4. Botão do Menu Hambúrguer - Visível apenas em telas menores */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o estado do menu
                            className="text-purple-600 hover:text-purple-800 focus:outline-none"
                            aria-label="Abrir menu"
                        >
                            {isMenuOpen ? (
                                <X size={32} /> // Ícone de "X" quando o menu está aberto
                            ) : (
                                <List size={32} /> // Ícone de "hambúrguer" quando fechado
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* 5. Menu Mobile - Renderização Condicional */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm absolute top-full left-0 w-full shadow-lg">
                    <div className="flex flex-col items-center space-y-4 py-8 text-lg font-semibold">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700 hover:text-purple-600">Home</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700 hover:text-purple-600">Serviços</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-gray-700 hover:text-purple-600">Sobre</a>
                        <a href="#gallery" onClick={(e) => scrollToSection(e, "gallery")} className="text-gray-600 hover:text-purple-600 transition-colors">Galeria</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-700 hover:text-purple-600">Contato</a>
                        
                        {/* Ícones de redes sociais no menu mobile */}
                        <div className="flex space-x-6 pt-4">
                            <a href="https://www.instagram.com/clinicaimperiodospets" target="_blank" rel="noopener noreferrer">
                                <InstagramLogo className="w-8 h-8 text-purple-500 hover:text-purple-600" />
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
            )}
        </nav>
    );
};

export default Header;