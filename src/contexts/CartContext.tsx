"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. O molde de como um item deve ser guardado no carrinho
export interface CartItem {
  idCart: string; // Um ID único gerado na hora (caso ele coloque 2 itens iguais, mas com artes diferentes)
  produtoNome: string;
  quantidadeTexto: string;
  preco: number;
  opcoesExtras: { nome: string; preco: number }[];
  arteUrl?: string; // Se ele já fez o upload da arte
}

// 2. O que o nosso "cérebro" vai saber fazer
interface CartContextData {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (idCart: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Assim que o site abre, ele "lembra" do que estava no carrinho
  useEffect(() => {
    const savedCart = localStorage.getItem('@CriacaoGrafica:cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // Toda vez que o carrinho muda, ele salva automaticamente no navegador
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('@CriacaoGrafica:cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Função para adicionar um novo item
  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  // Função para remover um item (no ícone de lixeira que faremos depois)
  const removeFromCart = (idCart: string) => {
    setCart((prev) => prev.filter(item => item.idCart !== idCart));
  };

  // Função para esvaziar tudo (depois que a compra for finalizada com sucesso)
  const clearCart = () => {
    setCart([]);
  };

  // Matemática automática: soma o valor de tudo que está no carrinho
  const cartTotal = cart.reduce((acc, item) => acc + item.preco, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// Uma função atalho para não precisarmos digitar muito nos outros arquivos
export function useCart() {
  return useContext(CartContext);
}