"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash, UploadSimple, Image as ImageIcon, ArrowLeft, Package, Hash } from "@phosphor-icons/react";

interface Variacao {
  id: number | string;
  nome: string;
  precoExtra: number;
}

interface Pacote {
  id: number | string;
  quantidade: number;
  preco: number;
}

function FormularioProduto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  
  // === NOVOS ESTADOS DE PRECIFICAÇÃO ===
  const [tipoPrecificacao, setTipoPrecificacao] = useState<"UNIDADE" | "PACOTE">("UNIDADE");
  const [precoBase, setPrecoBase] = useState(""); // Usado só se for UNIDADE
  const [pacotes, setPacotes] = useState<Pacote[]>([]); // Usado só se for PACOTE

  const [fotoCapa, setFotoCapa] = useState<File | null>(null);
  const [fotosExtras, setFotosExtras] = useState<File[]>([]);
  const [urlCapaAntiga, setUrlCapaAntiga] = useState("");

  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      const buscarProduto = async () => {
        try {
          const res = await fetch(`http://localhost:3333/produtos`);
          const produtosDb = await res.json();
          const produto = produtosDb.find((p: any) => p.id === editId);

          if (produto) {
            setNome(produto.nome);
            setDescricao(produto.descricao || "");
            
            // Carrega a inteligência de preços
            setTipoPrecificacao(produto.tipoPrecificacao || "UNIDADE");
            setPrecoBase(produto.precoBase?.toString() || "");
            if (produto.pacotes) {
              setPacotes(produto.pacotes.map((p: any) => ({ ...p, id: p.id || Date.now() + Math.random() })));
            }

            if (produto.imagemUrl) setUrlCapaAntiga(produto.imagemUrl);
            if (produto.variacoes) {
              setVariacoes(produto.variacoes.map((v: any) => ({ ...v, id: v.id })));
            }
          }
        } catch (error) {
          console.error("Erro ao buscar produto", error);
        } finally {
          setCarregandoDados(false);
        }
      };
      buscarProduto();
    }
  }, [editId]);

  // Funções para Variações (Acabamentos)
  const adicionarVariacao = () => setVariacoes([...variacoes, { id: Date.now(), nome: "", precoExtra: 0 }]);
  const removerVariacao = (id: number | string) => setVariacoes(variacoes.filter(v => v.id !== id));
  const atualizarVariacao = (id: number | string, campo: 'nome' | 'precoExtra', valor: any) => {
    setVariacoes(variacoes.map(v => v.id === id ? { ...v, [campo]: valor } : v));
  };

  // Funções para Pacotes Fechados (Quantidades)
  const adicionarPacote = () => setPacotes([...pacotes, { id: Date.now(), quantidade: 100, preco: 0 }]);
  const removerPacote = (id: number | string) => setPacotes(pacotes.filter(p => p.id !== id));
  const atualizarPacote = (id: number | string, campo: 'quantidade' | 'preco', valor: any) => {
    setPacotes(pacotes.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const subirArquivoParaServidor = async (arquivo: File) => {
    const envelope = new FormData();
    envelope.append("file", arquivo);
    const resposta = await fetch("http://localhost:3333/upload", { method: "POST", body: envelope });
    const dados = await resposta.json();
    return dados.url; 
  };

  const salvarProdutoCompleto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de segurança!
    if (tipoPrecificacao === "PACOTE" && pacotes.length === 0) {
      alert("Você escolheu vender por pacotes, mas não cadastrou nenhum pacote!");
      return;
    }

    setCarregando(true);

    try {
      let urlCapa = urlCapaAntiga; 
      if (fotoCapa) urlCapa = await subirArquivoParaServidor(fotoCapa);

      const urlsExtras = [];
      for (const foto of fotosExtras) urlsExtras.push(await subirArquivoParaServidor(foto));

      const pacoteFinal = {
        nome,
        descricao,
        // Envia o preço base apenas se for UNIDADE, senão envia 0 pra não sujar o banco
        precoBase: tipoPrecificacao === "UNIDADE" ? parseFloat(precoBase.toString().replace(',', '.')) || 0 : 0,
        tipoPrecificacao,
        pacotes: tipoPrecificacao === "PACOTE" ? pacotes : [],
        imagemUrl: urlCapa,
        imagensExtras: urlsExtras,
        variacoes
      };

      const urlFetch = editId ? `http://localhost:3333/produtos/${editId}` : "http://localhost:3333/produtos";
      const metodoFetch = editId ? "PUT" : "POST";

      const resposta = await fetch(urlFetch, {
        method: metodoFetch,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacoteFinal)
      });

      if (resposta.ok) {
        alert(`Produto ${editId ? 'atualizado' : 'cadastrado'} com sucesso!`);
        router.push("/painel/catalogo");
      } else {
        alert("Erro ao salvar produto no servidor.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setCarregando(false);
    }
  };

  if (carregandoDados) return <div className="text-center p-20 font-bold animate-pulse">Carregando dados...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.push('/painel/catalogo')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-[#262A2B]">
          {editId ? "✏️ Editar Serviço" : "Cadastrar Novo Serviço"}
        </h1>
      </div>

      <form onSubmit={salvarProdutoCompleto} className="space-y-8">
        
        {/* BLOCO 1: INFORMAÇÕES BÁSICAS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon size={24} className="text-yellow-500"/> Informações Principais</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
              <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Cartão de Visita, Banner Lona" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
              <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva os detalhes do serviço..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        {/* BLOCO 2: MOTOR DE PRECIFICAÇÃO (O SEGREDO DA GRÁFICA) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-yellow-400 ring-4 ring-yellow-50">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#262A2B]">💰 Como este produto será vendido?</h2>
          
          {/* Botões de Escolha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button 
              type="button" 
              onClick={() => setTipoPrecificacao("UNIDADE")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${tipoPrecificacao === "UNIDADE" ? "border-yellow-400 bg-yellow-50 text-[#262A2B]" : "border-gray-200 bg-white text-gray-500 hover:border-yellow-200"}`}
            >
              <Hash size={32} weight={tipoPrecificacao === "UNIDADE" ? "fill" : "regular"} />
              <span className="font-bold">Unidade Livre</span>
              <span className="text-xs text-center opacity-70">O cliente digita a quantidade (Ex: Banners, Lonas)</span>
            </button>

            <button 
              type="button" 
              onClick={() => setTipoPrecificacao("PACOTE")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${tipoPrecificacao === "PACOTE" ? "border-blue-500 bg-blue-50 text-blue-900" : "border-gray-200 bg-white text-gray-500 hover:border-blue-200"}`}
            >
              <Package size={32} weight={tipoPrecificacao === "PACOTE" ? "fill" : "regular"} />
              <span className="font-bold">Pacotes Fechados</span>
              <span className="text-xs text-center opacity-70">Vendido em lotes fixos (Ex: Cartões, Panfletos)</span>
            </button>
          </div>

          {/* DADOS DINÂMICOS BASEADOS NA ESCOLHA */}
          {tipoPrecificacao === "UNIDADE" ? (
            <div className="animate-fade-in p-6 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-1">Preço por Unidade (R$)</label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-3 text-gray-500 font-bold">R$</span>
                <input type="number" step="0.01" required={tipoPrecificacao === "UNIDADE"} value={precoBase} onChange={(e) => setPrecoBase(e.target.value)} placeholder="0.00" className="w-full pl-12 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-white" />
              </div>
              <p className="text-sm text-gray-500 mt-2">O cliente poderá escolher 1, 2, 3... e o sistema multiplicará por este valor.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Tabela de Quantidades e Preços</h3>
                <button type="button" onClick={adicionarPacote} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-bold hover:bg-blue-200 transition text-sm">
                  <Plus size={16} weight="bold" /> Adicionar Pacote
                </button>
              </div>
              
              {pacotes.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">Clique no botão acima para adicionar o primeiro pacote (Ex: 100un = R$50)</p>
              ) : (
                <div className="space-y-3">
                  {pacotes.map((pacote, index) => (
                    <div key={pacote.id} className="flex flex-col sm:flex-row gap-3 items-end bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Quantidade (Unidades)</label>
                        <input type="number" required placeholder="Ex: 1000" value={pacote.quantidade || ''} onChange={(e) => atualizarPacote(pacote.id, 'quantidade', parseInt(e.target.value) || 0)} className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Preço Total do Pacote (R$)</label>
                        <input type="number" step="0.01" required placeholder="Ex: 90.00" value={pacote.preco || ''} onChange={(e) => atualizarPacote(pacote.id, 'preco', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-blue-200 rounded-lg outline-none focus:border-blue-500 bg-white" />
                      </div>
                      <button type="button" onClick={() => removerPacote(pacote.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition" title="Remover pacote">
                        <Trash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BLOCO 3: IMAGENS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UploadSimple size={24} className="text-blue-500"/> Galeria de Fotos</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Foto de Capa (Vitrine)</label>
              {urlCapaAntiga && !fotoCapa && (
                <p className="text-xs text-green-600 mb-2 font-bold">✔️ Imagem atual já carregada. Só envie outra se quiser substituir.</p>
              )}
              <input type="file" accept="image/*" onChange={(e) => setFotoCapa(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Fotos Extras do Portfólio (Rodapé do Modal)</label>
              <input type="file" multiple accept="image/*" onChange={(e) => setFotosExtras(e.target.files ? Array.from(e.target.files) : [])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* BLOCO 4: VARIAÇÕES DINÂMICAS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Plus size={24} className="text-green-500"/> Opções e Acabamentos (Opcional)</h2>
            <button type="button" onClick={adicionarVariacao} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition">
              <Plus size={16} weight="bold" /> Adicionar Opção
            </button>
          </div>
          
          {variacoes.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Nenhum acabamento extra configurado.</p>
          ) : (
            <div className="space-y-3">
              {variacoes.map((variacao, index) => (
                <div key={variacao.id} className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nome da Opção {index + 1}</label>
                    <input type="text" placeholder="Ex: Verniz Localizado" value={variacao.nome} onChange={(e) => atualizarVariacao(variacao.id, 'nome', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-yellow-400 bg-white" />
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
          {carregando ? "Salvando no Banco de Dados..." : (editId ? "Salvar Alterações do Produto" : "Cadastrar Produto Completo")}
        </button>

      </form>
    </div>
  );
}

export default function AdminProdutosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800 pb-20">
      <Suspense fallback={<div className="text-center p-10 font-bold">Carregando painel...</div>}>
        <FormularioProduto />
      </Suspense>
    </div>
  );
}