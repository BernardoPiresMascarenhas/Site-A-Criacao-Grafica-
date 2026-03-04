"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Molde para o TypeScript saber o que vem do backend
interface Metricas {
  totalClientes: number;
  emProducao: number;
  orcamentos: number;
  faturamentoTotal: number;
}

export default function PainelPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  
  // Estado para guardar os números do Dashboard
  const [metricas, setMetricas] = useState<Metricas>({
    totalClientes: 0,
    emProducao: 0,
    orcamentos: 0,
    faturamentoTotal: 0
  });

  useEffect(() => {
    const carregarPainel = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Busca o Perfil
        const resPerfil = await fetch("http://localhost:3333/perfil", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        // Busca as Métricas
        const resMetricas = await fetch("http://localhost:3333/metricas", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (resPerfil.ok && resMetricas.ok) {
          const dadosPerfil = await resPerfil.json();
          const dadosMetricas = await resMetricas.json();
          
          setNomeUsuario(dadosPerfil.nome); 
          setMetricas(dadosMetricas); // Salva os números na tela
          setAutorizado(true);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Erro ao carregar painel:", error);
      }
    };

    carregarPainel();
  }, [router]);

  const fazerLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500 animate-pulse">A carregar dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
      
      {/* Cabeçalho */}
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

      <main className="max-w-6xl mx-auto mt-8 px-8 space-y-8">
        
        {/* SEÇÃO 1: Os Cartões de Métricas (Dashboard) */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Visão Geral da Gráfica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm font-medium">Faturamento (Entregues)</span>
              <span className="text-3xl font-bold text-green-600 mt-2">
                R$ {metricas.faturamentoTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm font-medium">Pedidos em Produção</span>
              <span className="text-3xl font-bold text-blue-600 mt-2">{metricas.emProducao}</span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm font-medium">Aguardando Aprovação</span>
              <span className="text-3xl font-bold text-yellow-600 mt-2">{metricas.orcamentos}</span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm font-medium">Clientes Cadastrados</span>
              <span className="text-3xl font-bold text-purple-600 mt-2">{metricas.totalClientes}</span>
            </div>

          </div>
        </section>

        {/* SEÇÃO 2: Menu de Acesso Rápido */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <button 
              onClick={() => router.push('/painel/clientes')}
              className="flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-400 transition-all text-left group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">👥</span>
              <div>
                <span className="block text-lg font-bold text-gray-800">Clientes</span>
                <span className="text-sm text-gray-500">Gerenciar carteira de clientes</span>
              </div>
            </button>

            <button 
              onClick={() => router.push('/painel/pedidos')}
              className="flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">🖨️</span>
              <div>
                <span className="block text-lg font-bold text-gray-800">Orçamentos</span>
                <span className="text-sm text-gray-500">Criar pedidos e gerenciar fila</span>
              </div>
            </button>

            {/* O NOVO BOTÃO DE PRODUTOS AQUI */}
            <button 
              onClick={() => router.push('/painel/catalogo')}
              className="flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-orange-400 transition-all text-left group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">🏷️</span>
              <div>
                <span className="block text-lg font-bold text-gray-800">Catálogo</span>
                <span className="text-sm text-gray-500">Cadastrar produtos da vitrine</span>
              </div>
            </button>

          </div>
        </section>

      </main>
    </div>
  );
}