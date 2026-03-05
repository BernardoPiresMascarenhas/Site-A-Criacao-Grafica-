"use client";

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { InstagramLogo, FacebookLogo, WhatsappLogo, List, X, User, SignOut, ShoppingCart } from "@phosphor-icons/react"; 
import Image from "next/image";
import { useCart } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [nomeCliente, setNomeCliente] = useState<string | null>(null);
    const router = useRouter(); 
    const { cart } = useCart(); 
    const [isCartOpen, setIsCartOpen] = useState(false); 

    useEffect(() => {
        const nomeSalvo = localStorage.getItem('nome_cliente');
        const dadosSalvos = localStorage.getItem('dados_cliente');
        let nomeDoJson = null;
        
        if (dadosSalvos) {
            try {
                const parsed = JSON.parse(dadosSalvos);
                nomeDoJson = parsed.nome;
            } catch (e) {}
        }

        if (nomeSalvo) {
            setNomeCliente(nomeSalvo);
        } else if (nomeDoJson) {
            setNomeCliente(nomeDoJson);
        }
    }, []);

    const fazerLogout = () => {
        localStorage.removeItem("token_cliente");
        localStorage.removeItem("nome_cliente");
        localStorage.removeItem("dados_cliente"); // Boa prática limpar tudo!
        setNomeCliente(null);
        router.push("/"); 
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
                                    unoptimized
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

                        {/* ÁREA DO CLIENTE (DESKTOP) */}
                        <div className="flex items-center gap-4 ml-2 border-l-2 border-gray-200 pl-6">
                            {nomeCliente ? (
                                <>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-xs text-gray-500 font-normal">Bem-vindo(a),</span>
                                        <span className="font-bold text-[#262A2B] truncate max-w-[120px]" title={nomeCliente}>
                                            {nomeCliente.split(' ')[0]}
                                        </span>
                                        
                                        <div className="flex items-center gap-2 mt-1">
                                            <button onClick={() => router.push('/minha-conta')} className="text-[11px] text-gray-500 hover:text-[#262A2B] font-bold text-left hover:underline transition-colors">
                                                Minha conta
                                            </button>
                                            <span className="text-gray-300 text-[10px]">|</span>
                                            <button onClick={() => router.push('/meus-pedidos')} className="text-[11px] text-yellow-600 hover:text-yellow-700 font-bold text-left hover:underline transition-colors">
                                                Meus pedidos
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button onClick={fazerLogout} title="Sair da conta" className="text-gray-400 hover:text-red-500 transition-colors p-2 ml-2">
                                        <SignOut size={24} weight="bold" />
                                    </button>

                                    {/* BOTÃO DO CARRINHO */}
                                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-yellow-500 transition-colors">
                                        <ShoppingCart size={28} weight="bold" />
                                        {cart.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                                {cart.length}
                                            </span>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => router.push('/login-cliente')} className="flex items-center gap-2 text-gray-700 hover:text-yellow-400 font-bold transition">
                                        <User size={20} weight="bold" />
                                        Entrar
                                    </button>
                                    <button onClick={() => router.push('/cadastro-cliente')} className="bg-[#262A2B] text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition-all shadow-sm text-sm">
                                        Criar Conta                                  
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ICONES MOBILE (CARRINHO + HAMBÚRGUER) */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-800 hover:text-yellow-500 transition-colors">
                            <ShoppingCart size={28} weight="bold" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 hover:text-[#ECE537] focus:outline-none">
                            {isMenuOpen ? <X size={32} /> : <List size={32} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Menu Mobile Expandido */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm absolute top-full left-0 w-full shadow-lg border-t border-gray-100 pb-6 z-40">
                    <div className="flex flex-col items-center space-y-4 pt-6 pb-4 text-lg font-semibold">
                        <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-700">Home</a>
                        <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-700">Serviços</a>
                        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-700">Contato</a>
                    </div>

                    {/* ÁREA DO CLIENTE MOBILE */}
                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200 mx-8 mt-2">
                        {nomeCliente ? (
                            <>
                                <span className="text-gray-800 font-bold mb-2">Olá, {nomeCliente}</span>
                                
                                <button onClick={() => { router.push('/minha-conta'); setIsMenuOpen(false); }} className="w-full text-center text-gray-600 font-bold py-2 border-b border-gray-100">
                                    Minha Conta
                                </button>
                                <button onClick={() => { router.push('/meus-pedidos'); setIsMenuOpen(false); }} className="w-full text-center text-yellow-600 font-bold py-2 border-b border-gray-100">
                                    Meus Pedidos
                                </button>

                                <button onClick={() => { fazerLogout(); setIsMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full text-red-500 font-bold py-2 mt-2 border border-red-200 rounded-lg hover:bg-red-50">
                                    <SignOut size={20} weight="bold" />
                                    Sair da Conta
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => { router.push('/login-cliente'); setIsMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full text-gray-700 font-bold py-2 border border-gray-300 rounded-lg">
                                    <User size={20} weight="bold" />
                                    Já tenho conta (Entrar)
                                </button>
                                <button onClick={() => { router.push('/cadastro-cliente'); setIsMenuOpen(false); }} className="w-full bg-[#262A2B] text-white py-2 rounded-lg font-bold">
                                    Criar Conta
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* O SIDEBAR DO CARRINHO FICA AQUI, ESCONDIDINHO! */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
};

export default Header;