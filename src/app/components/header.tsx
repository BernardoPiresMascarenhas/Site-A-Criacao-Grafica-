"use client";

import { useState } from 'react'; 
import { InstagramLogo, FacebookLogo, WhatsappLogo, List, X } from "@phosphor-icons/react"; 
import Image from "next/image";

const Header = () => {
   
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="bg-white bg-[url('/header-background.png')] bg-repeat-x bg-[size:400px_auto]  shadow-sm sticky top-0 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-36 items-center">
                    <div className="flex items-center">
                        {/* Logo */}
                        <a
                            href="#home"
                            onClick={(e) => scrollToSection(e, "home")}
                        >
                            <div className="relative w-[220px] md:w-[330px] aspect-square transition-all duration-300">
                                <Image
                                    src="/logo.png"
                                    alt="Logo A Criação Gráfica" 
                                    layout="fill"
                                    objectFit="contain"
                                    className="transition-transform duration-300 ease-in-out hover:scale-110"
                                />
                            </div>
                        </a>
                    </div>

                    {/* Links do Menu Desktop - Escondido em telas menores (md) */}
                    <div className="hidden md:flex items-center space-x-8 text-lg font-semibold">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700 hover:text-[#ECE537]">Home</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-gray-700 hover:text-[#ECE537]">Sobre</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700 hover:text-[#ECE537]">Serviços</a>
                        <a href="#cliente" onClick={(e) => scrollToSection(e, "cliente")} className="text-gray-600 hover:text-[#ECE537] transition-colors">Clientes</a>
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
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-yellow-300 hover:text-yellow-300 focus:outline-none"
                            aria-label="Abrir menu"
                        >
                            {isMenuOpen ? (
                                <X size={32} /> 
                            ) : (
                                <List size={32} /> 
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* 5. Menu Mobile - Renderização Condicional */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm absolute top-full left-0 w-full shadow-lg">
                    <div className="flex flex-col items-center space-y-4 py-8 text-lg font-semibold">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700 hover:text-yellow-300">Home</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700 hover:text-yellow-300">Serviços</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-gray-700 hover:text-yellow-300">Sobre</a>
                        <a href="#cliente" onClick={(e) => scrollToSection(e, "cliente")} className="text-gray-600 hover:text-yellow-300 transition-colors">Clientes</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-700 hover:text-yellow-300">Contato</a>
                        
                        {/* Ícones de redes sociais no menu mobile */}
                        <div className="flex space-x-6 pt-4">
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
            )}
        </nav>
    );
};

export default Header;