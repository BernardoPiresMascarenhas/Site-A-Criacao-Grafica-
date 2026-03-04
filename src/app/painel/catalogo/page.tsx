"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash, Plus, PencilSimple, ArrowLeft } from "@phosphor-icons/react";

interface Produto {
  id: string;
  nome: string;
  precoBase: number;
  imagemUrl: string;
}

export default function GerenciarCatalogoPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch("http://localhost:3333/produtos");
      if (resposta.ok) {
        setProdutos(await resposta.json());
      }
    } catch (error) {
      console.error("Erro ao carregar catálogo:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const deletarProduto = async (id: string, nome: string) => {
    const confirmacao = window.confirm(`Tem certeza que deseja apagar o produto "${nome}"? Esta ação não pode ser desfeita.`);
    
    if (confirmacao) {
      try {
        const resposta = await fetch(`http://localhost:3333/produtos/${id}`, {
          method: "DELETE"
        });

        if (resposta.ok) {
          // Atualiza a lista na tela removendo o produto deletado
          setProdutos(produtos.filter(p => p.id !== id));
          alert("Produto excluído com sucesso!");
        } else {
          alert("Erro ao excluir o produto.");
        }
      } catch (error) {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          
          <div className="flex items-center gap-4">
            {/* A SETINHA AQUI! */}
            <button 
              onClick={() => router.push('/painel')} 
              className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-200 transition text-gray-600 hover:text-gray-900"
              title="Voltar para o Painel Inicial"
            >
              <ArrowLeft size={24} weight="bold" />
            </button>
            <h1 className="text-3xl font-black text-[#262A2B]">Gerenciar Catálogo</h1>
          </div>

          <button 
            onClick={() => router.push('/painel/produtos')} 
            className="flex items-center gap-2 bg-[#262A2B] text-white px-5 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition shadow-sm"
          >
            <Plus size={20} weight="bold" /> Novo Produto
          </button>
        </div>

        {/* Lista de Produtos */}
        {carregando ? (
          <div className="text-center py-20 text-gray-500 font-bold animate-pulse">Carregando catálogo...</div>
        ) : produtos.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4">Seu catálogo está vazio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col">
                
                {/* Foto do Produto */}
                <div className="relative w-full h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  {produto.imagemUrl ? (
                    <Image 
                      src={produto.imagemUrl} 
                      alt={produto.nome} 
                      fill 
                      className="object-contain"
                      unoptimized 
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sem imagem</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">{produto.nome}</h3>
                  <p className="text-sm font-black text-green-600 mt-1">
                    A partir de R$ {produto.precoBase.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => alert("A tela de edição completa será construída na próxima fase!")}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition"
                  >
                    <PencilSimple size={18} /> Editar
                  </button>
                  <button 
                    onClick={() => deletarProduto(produto.id, produto.nome)}
                    className="flex items-center justify-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    title="Excluir Produto"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}