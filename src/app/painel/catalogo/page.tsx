"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash, Plus, PencilSimple, ArrowLeft, X } from "@phosphor-icons/react";

interface Produto {
  id: string;
  nome: string;
  precoBase: number;
  imagemUrl: string;
  tipoPrecificacao?: string; // <-- ADICIONAR ESTA LINHA
  pacotes?: any[];           // <-- ADICIONAR ESTA LINHA
}

export default function GerenciarCatalogoPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  // === ESTADOS DO MODAL DE EDIÇÃO ===
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editPrecoBase, setEditPrecoBase] = useState("");
  const [editImagemUrl, setEditImagemUrl] = useState("");

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

  // === FUNÇÕES DE EDIÇÃO ===
  const iniciarEdicao = (produto: Produto) => {
    setProdutoEditando(produto);
    setEditNome(produto.nome);
    setEditPrecoBase(produto.precoBase.toString());
    setEditImagemUrl(produto.imagemUrl || "");
  };

  const cancelarEdicao = () => {
    setProdutoEditando(null);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarregar a página
    if (!produtoEditando) return;

    try {
      const resposta = await fetch(`http://localhost:3333/produtos/${produtoEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editNome,
          precoBase: Number(editPrecoBase),
          imagemUrl: editImagemUrl,
        }),
      });

      if (resposta.ok) {
        const produtoAtualizado = await resposta.json();
        
        // Mágica do React: Atualiza a lista na tela sem precisar bater no banco de novo!
        setProdutos(produtos.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p));
        
        alert("Produto atualizado com sucesso!");
        cancelarEdicao(); // Fecha o modal
      } else {
        alert("Erro ao atualizar o produto.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  const deletarProduto = async (id: string, nome: string) => {
    const confirmacao = window.confirm(`Tem certeza que deseja apagar o produto "${nome}"? Esta ação não pode ser desfeita.`);
    if (confirmacao) {
      try {
        const resposta = await fetch(`http://localhost:3333/produtos/${id}`, { method: "DELETE" });
        if (resposta.ok) {
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

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
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
            className="flex items-center gap-2 bg-[#262A2B] text-white px-5 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-[#262A2B] transition shadow-sm"
          >
            <Plus size={20} weight="bold" /> Novo Produto
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex items-center gap-4">
          <div className="flex-1 w-full relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Pesquisar produto pelo nome (ex: Cartão de Visita, Banner)..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-[#262A2B]"
            />
          </div>
        </div>

        {/* Lista de Produtos */}
        {carregando ? (
          <div className="text-center py-20 text-gray-500 font-bold animate-pulse">Carregando catálogo...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-400 transition-all duration-300 flex flex-col group">
                
                <div className="relative w-full h-40 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-gray-100">
                  {produto.imagemUrl ? (
                    <Image src={produto.imagemUrl} alt={produto.nome} fill className="object-contain" unoptimized />
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">Sem imagem</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-lg text-[#262A2B] leading-tight group-hover:text-yellow-600 transition-colors">{produto.nome}</h3>
                  <p className="text-sm font-bold text-gray-500 mt-1">
                    A partir de R$ {
                      (produto.tipoPrecificacao === 'PACOTE' && produto.pacotes && produto.pacotes.length > 0)
                        ? Math.min(...produto.pacotes.map((p: any) => p.preco)).toFixed(2).replace('.', ',')
                        : produto.precoBase.toFixed(2).replace('.', ',')
                    }
                  </p>
                </div>

                {/* Botões de Ação Atualizados */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => router.push(`/painel/produtos?id=${produto.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#262A2B] text-white py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 hover:text-[#262A2B] transition-all shadow-sm"
                  >
                    <PencilSimple size={18} weight="bold" /> Editar
                  </button>
                  <button 
                    onClick={() => deletarProduto(produto.id, produto.nome)}
                    className="flex items-center justify-center p-2 bg-gray-50 text-red-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition border border-gray-200"
                    title="Excluir Produto"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO FLUTUANTE */}
      {produtoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            
            {/* Cabeçalho do Modal */}
            <div className="bg-[#262A2B] p-4 flex justify-between items-center">
              <h2 className="text-white font-black text-lg flex items-center gap-2">
                <PencilSimple size={20} className="text-yellow-400" weight="bold" /> 
                Editar Produto
              </h2>
              <button onClick={cancelarEdicao} className="text-gray-400 hover:text-white transition">
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={salvarEdicao} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  required
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preço Base (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={editPrecoBase}
                  onChange={(e) => setEditPrecoBase(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL da Imagem</label>
                <input 
                  type="text" 
                  value={editImagemUrl}
                  onChange={(e) => setEditImagemUrl(e.target.value)}
                  placeholder="Link da imagem (opcional)"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
                />
              </div>

              {/* Botões do Modal */}
              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={cancelarEdicao}
                  className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 font-bold text-[#262A2B] bg-yellow-400 rounded-xl hover:bg-yellow-500 shadow-sm transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}