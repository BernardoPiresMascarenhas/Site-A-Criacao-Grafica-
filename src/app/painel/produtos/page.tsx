"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash, UploadSimple, Image as ImageIcon, ArrowLeft } from "@phosphor-icons/react";

interface Variacao {
  id: number;
  nome: string;
  precoExtra: number;
}

export default function AdminProdutosPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoBase, setPrecoBase] = useState("");
  
  // Arquivos físicos
  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [fotosExtras, setFotosExtras] = useState<File[]>([]);
  
  // Variações Dinâmicas (O configurador da gráfica!)
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Adiciona uma nova linha de variação em branco
  const adicionarVariacao = () => {
    setVariacoes([...variacoes, { id: Date.now(), nome: "", precoExtra: 0 }]);
  };

  // Remove uma linha de variação
  const removerVariacao = (id: number) => {
    setVariacoes(variacoes.filter(v => v.id !== id));
  };

  // Atualiza o texto ou preço de uma variação específica
  const atualizarVariacao = (id: number, campo: 'nome' | 'precoExtra', valor: any) => {
    setVariacoes(variacoes.map(v => v.id === id ? { ...v, [campo]: valor } : v));
  };

  // FUNÇÃO MÁGICA: Manda a foto pro servidor e devolve a URL
  const subirArquivoParaServidor = async (arquivo: File) => {
    const envelope = new FormData();
    envelope.append("file", arquivo);
    const resposta = await fetch("http://localhost:3333/upload", {
      method: "POST",
      body: envelope,
    });
    const dados = await resposta.json();
    return dados.url; // Retorna ex: http://localhost:3333/files/xyz-foto.jpg
  };

  const salvarProdutoCompleto = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // 1. Faz upload da Capa (se houver)
      let urlCapa = "";
      if (fotoCapa) {
        urlCapa = await subirArquivoParaServidor(fotoCapa);
      }

      // 2. Faz upload das Fotos Extras (se houver)
      const urlsExtras = [];
      for (const foto of fotosExtras) {
        const url = await subirArquivoParaServidor(foto);
        urlsExtras.push(url);
      }

      // 3. Monta o pacote final e manda salvar no banco de dados!
      const pacoteFinal = {
        nome,
        descricao,
        precoBase: parseFloat(precoBase.replace(',', '.')),
        imagemUrl: urlCapa,
        imagensExtras: urlsExtras,
        variacoes: variacoes // O JSON lindão
      };

      const resposta = await fetch("http://localhost:3333/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacoteFinal)
      });

      if (resposta.ok) {
        alert("Produto cadastrado com sucesso na vitrine!");
        router.push("/painel/catalogo"); // Volta pro dashboard
      } else {
        alert("Erro ao salvar produto.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800 pb-20">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/painel/catalogo')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black text-[#262A2B]">Cadastrar Novo Serviço</h1>
        </div>

        <form onSubmit={salvarProdutoCompleto} className="space-y-8">
          
          {/* BLOCO 1: DADOS BÁSICOS */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon size={24} className="text-yellow-500"/> Informações Principais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Cartão de Visita" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Preço Base (A partir de)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-bold">R$</span>
                  <input type="number" step="0.01" required value={precoBase} onChange={(e) => setPrecoBase(e.target.value)} placeholder="50.00" className="w-full pl-12 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva os detalhes do serviço..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white" />
              </div>
            </div>
          </div>

          {/* BLOCO 2: IMAGENS (UPLOAD REAL) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UploadSimple size={24} className="text-blue-500"/> Galeria de Fotos</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Foto de Capa (Vitrine)</label>
                <input type="file" accept="image/*" onChange={(e) => setFotoCapa(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Fotos Extras do Portfólio (Rodapé do Modal)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setFotosExtras(e.target.files ? Array.from(e.target.files) : [])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
                <p className="text-xs text-gray-400 mt-2">Pode selecionar vários arquivos segurando o Ctrl.</p>
              </div>
            </div>
          </div>

          {/* BLOCO 3: AS VARIAÇÕES DINÂMICAS */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Plus size={24} className="text-green-500"/> Opções e Acabamentos</h2>
              <button type="button" onClick={adicionarVariacao} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition">
                <Plus size={16} weight="bold" /> Adicionar Opção
              </button>
            </div>
            
            {variacoes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Nenhum acabamento extra configurado. O produto terá apenas o preço base.</p>
            ) : (
              <div className="space-y-3">
                {variacoes.map((variacao, index) => (
                  <div key={variacao.id} className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Nome da Opção {index + 1}</label>
                      <input type="text" placeholder="Ex: Couché 300g" value={variacao.nome} onChange={(e) => atualizarVariacao(variacao.id, 'nome', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-yellow-400 bg-white" />
                    </div>
                    <div className="w-full sm:w-40">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Adicional (R$)</label>
                      <input type="number" step="0.01" value={variacao.precoExtra} onChange={(e) => atualizarVariacao(variacao.id, 'precoExtra', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-yellow-400 bg-white" />
                    </div>
                    <button type="button" onClick={() => removerVariacao(variacao.id)} className="p-3 text-red-500 hover:bg-red-100 rounded-lg transition" title="Remover opção">
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTÃO SALVAR */}
          <button type="submit" disabled={carregando} className="w-full py-4 bg-[#262A2B] text-white rounded-xl font-black text-xl hover:bg-yellow-400 hover:text-black transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2">
            {carregando ? "Salvando no Banco de Dados..." : "Cadastrar Produto Completo"}
          </button>

        </form>
      </div>
    </div>
  );
}