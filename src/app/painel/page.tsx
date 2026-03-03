"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PainelPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const buscarPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const resposta = await fetch("http://localhost:3333/perfil", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setNomeUsuario(dados.nome); 
          setAutorizado(true);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    buscarPerfil();
  }, [router]);

  const fazerLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500 animate-pulse">A verificar segurança...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* Cabeçalho do Sistema */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">A Criação Gráfica</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bem-vindo(a), <span className="font-semibold text-blue-500">{nomeUsuario}</span>
          </p>
        </div>
        <button 
          onClick={fazerLogout} 
          className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Sair do Sistema
        </button>
      </header>

      {/* Área de Trabalho (Menu) */}
      <main className="max-w-5xl mx-auto mt-12 px-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">O que você deseja fazer hoje?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Botão de Clientes */}
          <button 
            onClick={() => router.push('/painel/clientes')}
            className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group text-center"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">👥</span>
            <span className="text-lg font-bold text-gray-800">Gerenciar Clientes</span>
            <span className="text-sm text-gray-500 mt-2">Cadastrar, visualizar e editar os clientes da gráfica.</span>
          </button>

          {/* Botão de Pedidos & Orçamentos */}
          <button 
            onClick={() => router.push('/painel/pedidos')}
            className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group text-center"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🖨️</span>
            <span className="text-lg font-bold text-gray-800">Pedidos & Orçamentos</span>
            <span className="text-sm text-gray-500 mt-2">Criar orçamentos e gerenciar pedidos da gráfica.</span>
          </button>

        </div>
      </main>

    </div>
  );
}