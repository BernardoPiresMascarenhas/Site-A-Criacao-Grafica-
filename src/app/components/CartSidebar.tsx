"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash, ShoppingCart, ArrowRight } from '@phosphor-icons/react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose(); // Fecha a aba
    router.push('/checkout'); // Leva para a tela de pagamento/resumo (vamos criar no próximo passo!)
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fundo Escuro (Overlay) que fecha o carrinho se clicar fora */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* O Carrinho Deslizante */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Cabeçalho do Carrinho */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 text-[#262A2B]">
                <ShoppingCart size={28} weight="fill" className="text-yellow-400" />
                <h2 className="text-2xl font-black">Meu Carrinho</h2>
                <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Fechar Carrinho"
              >
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingCart size={64} weight="light" />
                  <p className="text-lg font-bold text-gray-500">Seu carrinho está vazio.</p>
                  <button onClick={onClose} className="text-yellow-600 font-bold hover:underline">
                    Continuar comprando
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.idCart} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 relative group hover:shadow-md transition-shadow">
                    <div className="flex-1 pr-8">
                      <h3 className="font-bold text-[#262A2B] leading-tight">{item.produtoNome}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.quantidadeTexto}</p>
                      
                      {/* Mostra os acabamentos extras escolhidos */}
                      {item.opcoesExtras && item.opcoesExtras.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.opcoesExtras.map((opcao, idx) => (
                            <p key={idx} className="text-[10px] text-gray-400 font-semibold uppercase">
                              + {opcao.nome}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      <p className="mt-3 font-black text-lg text-[#262A2B]">
                        R$ {item.preco.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.idCart)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remover item"
                    >
                      <Trash size={20} weight="fill" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé (Valor Total e Botão Finalizar) */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total a pagar</span>
                  <span className="text-3xl font-black text-[#262A2B]">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-[#262A2B] font-black text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  Finalizar Compra <ArrowRight size={24} weight="bold" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}