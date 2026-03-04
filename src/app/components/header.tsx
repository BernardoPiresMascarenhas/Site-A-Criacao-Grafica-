"use client";

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { InstagramLogo, FacebookLogo, WhatsappLogo, List, X, User, SignOut } from "@phosphor-icons/react"; 
import Image from "next/image";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [nomeCliente, setNomeCliente] = useState<string | null>(null);
    const router = useRouter(); 

    // O Next.js dá uma espiada no navegador para ver se o cliente está logado
    useEffect(() => {
        const nomeSalvo = localStorage.getItem("nome_cliente");
        if (nomeSalvo) {
            setNomeCliente(nomeSalvo);
        }
    }, []);

    const fazerLogout = () => {
        localStorage.removeItem("token_cliente");
        localStorage.removeItem("nome_cliente");
        setNomeCliente(null);
        router.push("/"); // Atualiza a página
    };

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
        
        if (isMenuOpen) setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white bg-[url('/header-background.png')] bg-repeat-x bg-[size:400px_auto] shadow-sm sticky top-0 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-36 items-center">
                    
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")}>
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

                    {/* Links do Menu Desktop */}
                    <div className="hidden md:flex items-center space-x-6 text-lg font-semibold">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700 hover:text-[#ECE537] transition">Home</a>
                        <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-gray-700 hover:text-[#ECE537] transition">Sobre</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700 hover:text-[#ECE537] transition">Serviços</a>
                        <a href="#social-feed" onClick={(e) => scrollToSection(e, "social-feed")} className="text-gray-700 hover:text-[#ECE537] transition">Feed</a>
                        <a href="#testimonials" onClick={(e) => scrollToSection(e, "testimonials")} className="text-gray-700 hover:text-[#ECE537] transition">Avaliações</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-700 hover:text-[#ECE537] transition">Contato</a>
                        
                        {/* Redes Sociais */}
                        <div className="flex space-x-3 ml-2 border-l-2 border-gray-200 pl-6">
                            <a href="https://www.instagram.com/acriacaografic/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-[#262A2B] rounded-full transition-transform duration-300 transform hover:scale-110">
                                <InstagramLogo className="w-5 h-5 text-yellow-400" />
                            </a>
                            <a href="https://www.facebook.com/acriacaografic/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 bg-[#262A2B] rounded-full transition-transform duration-300 transform hover:scale-110">
                                <FacebookLogo className="w-6 h-6 text-yellow-400" />
                            </a>
                        </div>

                        {/* ÁREA DO CLIENTE (MÁGICA ACONTECENDO AQUI) */}
                        <div className="flex items-center gap-4 ml-2 border-l-2 border-gray-200 pl-6">
                            {nomeCliente ? (
                                // SE ESTIVER LOGADO:
                                <>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-xs text-gray-500 font-normal">Bem-vindo(a),</span>
                                        <span className="font-bold text-[#262A2B] truncate max-w-[120px]" title={nomeCliente}>
                                            {nomeCliente.split(' ')[0]}
                                        </span>
                                        <button 
                                            onClick={() => router.push('/meus-pedidos')}
                                            className="text-xs text-yellow-600 hover:text-yellow-700 font-bold text-left mt-1 hover:underline transition-colors"
                                        >
                                            Ver meus pedidos
                                        </button>
                                    </div>
                                    <button 
                                        onClick={fazerLogout}
                                        title="Sair da conta"
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <SignOut size={24} weight="bold" />
                                    </button>
                                </>
                            ) : (
                                // SE NÃO ESTIVER LOGADO:
                                <>
                                    <button 
                                        onClick={() => router.push('/login-cliente')}
                                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold transition"
                                    >
                                        <User size={20} weight="bold" />
                                        Entrar
                                    </button>
                                    <button 
                                        onClick={() => router.push('/cadastro-cliente')}
                                        className="bg-[#262A2B] text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all shadow-sm text-sm"
                                    >
                                        Criar Conta
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Botão do Menu Hambúrguer (Mobile) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-gray-800 hover:text-[#ECE537] focus:outline-none"
                        >
                            {isMenuOpen ? <X size={32} /> : <List size={32} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm absolute top-full left-0 w-full shadow-lg border-t border-gray-100 pb-6">
                    <div className="flex flex-col items-center space-y-4 pt-6 pb-4 text-lg font-semibold">
                        {/* Links omitidos para focar no E-commerce */}
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700">Home</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700">Serviços</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-700">Contato</a>
                    </div>

                    {/* ÁREA DO CLIENTE MOBILE */}
                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200 mx-8 mt-2">
                        {nomeCliente ? (
                            <>
                                <span className="text-gray-800 font-bold">Olá, {nomeCliente}</span>
                                <button 
                                    onClick={() => { fazerLogout(); setIsMenuOpen(false); }}
                                    className="flex items-center justify-center gap-2 w-full text-red-500 font-bold py-2 border border-red-200 rounded-lg hover:bg-red-50"
                                >
                                    <SignOut size={20} weight="bold" />
                                    Sair da Conta
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => { router.push('/login-cliente'); setIsMenuOpen(false); }}
                                    className="flex items-center justify-center gap-2 w-full text-gray-700 font-bold py-2 border border-gray-300 rounded-lg"
                                >
                                    <User size={20} weight="bold" />
                                    Já tenho conta (Entrar)
                                </button>
                                <button 
                                    onClick={() => { router.push('/cadastro-cliente'); setIsMenuOpen(false); }}
                                    className="w-full bg-[#262A2B] text-white py-2 rounded-lg font-bold"
                                >
                                    Criar Conta
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
                            
                            