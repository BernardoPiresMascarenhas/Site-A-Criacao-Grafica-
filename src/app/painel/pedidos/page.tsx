"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WhatsappLogo, Plus} from "@phosphor-icons/react";

interface Cliente {
  id: string;
  nome: string;
}

interface Pedido {
  id: string;
  descricao: string;
  valor: number;
  status: string;
  arquivoArte?: string | null;
  detalhes?: any;
  criadoEm?: string;
  cliente?: {
    nome: string;
    email?: string;
    telefone?: string;
  };
}

export default function PedidosPage() {
  const router = useRouter();
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); 

  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarDados = async () => {
    const token = localStorage.getItem("token_cliente");
    if (!token) {
      router.push("/login-cliente");
      return;
    }

    try {
      const resPedidos = await fetch("http://localhost:3333/pedidos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resClientes = await fetch("http://localhost:3333/clientes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resPedidos.ok && resClientes.ok) {
        setPedidos(await resPedidos.json());
        setClientes(await resClientes.json());
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [router]);

  const cadastrarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Salvando orçamento...");
    const token = localStorage.getItem("token_cliente");

    try {
      const resposta = await fetch("http://localhost:3333/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          descricao, 
          valor: parseFloat(valor),
          clienteId 
        })
      });

      if (resposta.ok) {
        setMensagem("Orçamento criado com sucesso!");
        setDescricao("");
        setValor("");
        setClienteId("");
        carregarDados(); 
        setTimeout(() => setMensagem(""), 3000);
      } else {
        setMensagem("Erro ao criar o orçamento.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  const alterarStatus = async (pedidoId: string, novoStatus: string) => {
    const token = localStorage.getItem("token_cliente");
    
    try {
      const resposta = await fetch(`http://localhost:3333/pedidos/${pedidoId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: novoStatus })
      });

      if (resposta.ok) {
        carregarDados(); 
      } else {
        alert("Erro ao atualizar o status.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const deletarPedido = async (pedidoId: string) => {
    const confirmacao = window.confirm("Tem certeza que deseja apagar este orçamento permanentemente?");
    if (!confirmacao) return; 

    const token = localStorage.getItem("token_cliente");
    
    try {
      const resposta = await fetch(`http://localhost:3333/pedidos/${pedidoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resposta.ok) {
        carregarDados(); 
      } else {
        alert("Erro ao deletar o pedido.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const gerarLinkWhatsApp = (pedido: any) => {
    const telefone = pedido.cliente?.telefone || ""; 
    const numeroLimpo = telefone.replace(/\D/g, ''); 
    const nomeCliente = pedido.cliente?.nome ? pedido.cliente.nome.split(' ')[0] : "Cliente";
    let mensagem = "";

    if (pedido.status === "ORÇAMENTO") {
      mensagem = `Olá, ${nomeCliente}! Recebemos o seu pedido de orçamento para "${pedido.descricao}". Em breve entraremos em contato com os detalhes e valores finais!`;
    } else if (pedido.status === "PRODUÇÃO") {
      mensagem = `Olá, ${nomeCliente}! Boas notícias: o seu pedido "${pedido.descricao}" acabou de entrar em produção na A Criação Gráfica! 🖨️🚀`;
    } else if (pedido.status === "PRONTO") {
      mensagem = `Olá, ${nomeCliente}! O seu pedido "${pedido.descricao}" está PRONTO para retirada! 🎉 Já pode vir buscar na nossa gráfica.`;
    }

    return `https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=${encodeURIComponent(mensagem)}`;
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchBusca = 
      pedido.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (pedido.cliente?.nome && pedido.cliente.nome.toLowerCase().includes(termoBusca.toLowerCase()));
      
    const matchStatus = filtroStatus === "TODOS" || pedido.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-[#262A2B]">Pedidos & Orçamentos</h1>
          <button onClick={() => router.push("/painel")} className="text-gray-500 hover:text-yellow-400 underline font-bold">
            Voltar ao Painel
          </button>
        </div>

        {/* Formulário Manual */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Novo Orçamento Manual</h2>
          <form onSubmit={cadastrarPedido} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Descrição do serviço (Ex: 1000 Cartões)" value={descricao} onChange={(e) => setDescricao(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 outline-none" />
            <input type="number" step="0.01" placeholder="Valor (R$)" value={valor} onChange={(e) => setValor(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 outline-none" />
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 outline-none bg-white">
              <option value="" disabled>Selecione um Cliente...</option>
              {clientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)}
            </select>
            <button onClick={() => alert("Função de criar orçamento manual em breve!")} className="flex items-center justify-center md:justify-start w-max gap-2 bg-[#262A2B] text-white px-5 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-[#262A2B] transition-all shadow-md">
               <Plus size={20} weight="bold" /> Criar Orçamento                                         
            </button>
          </form>
          {mensagem && <p className="mt-4 text-center text-green-600 font-medium">{mensagem}</p>}
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Histórico de Pedidos</h2>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" placeholder="Pesquisar por cliente ou descrição..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-[#262A2B] font-medium" />
            </div>
            <div className="w-full md:w-64">
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-[#262A2B] font-bold cursor-pointer">
                <option value="TODOS">Todos os Status</option>
                <option value="ORÇAMENTO">🟡 Orçamentos</option>
                <option value="PRODUÇÃO">🔵 Em Produção</option>
                <option value="PRONTO">🟢 Prontos / Entregues</option>
              </select>
            </div>
          </div>

          {pedidosFiltrados.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-bold">Nenhum pedido registrado ainda.</div>
          ) : (
            <div className="space-y-4">
               {pedidosFiltrados.map((pedido) => (
                    <div key={pedido.id} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-300">
                      
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <p className="font-black text-xl text-[#262A2B] leading-none break-words">
                              {pedido.descricao}
                            </p>
                            {pedido.criadoEm && (
                              <span className="text-[10px] bg-gray-100 text-[#262A2B] px-2 py-1 rounded-md font-bold border border-gray-200 shrink-0">
                                📅 {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')} às {new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-[#262A2B] space-y-1">
                            <p><span className="font-bold">👤 Cliente:</span> {pedido.cliente?.nome}</p>
                            {pedido.cliente?.telefone && <p><span className="font-bold">📱 WhatsApp:</span> {pedido.cliente.telefone}</p>}
                            {pedido.cliente?.email && <p><span className="font-bold">✉️ E-mail:</span> {pedido.cliente.email}</p>}
                          </div>
                        </div>
                        
                        <div className="shrink-0 flex items-center gap-4 bg-yellow-50 px-5 py-3 rounded-xl border border-yellow-200">
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-yellow-700 tracking-wider">Valor Total</p>
                            <p className="font-black text-[#262A2B] text-xl whitespace-nowrap">R$ {pedido.valor.toFixed(2).replace('.', ',')}</p>
                          </div>
                          <div className="h-8 w-px bg-yellow-300 mx-2"></div>
                          <button onClick={() => deletarPedido(pedido.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 transition p-2 rounded-lg" title="Deletar orçamento">
                             🗑️
                          </button>
                        </div>
                      </div>

                      {/* --- A MÁGICA DOS DETALHES DO CARRINHO ACONTECE AQUI --- */}
                      
                      {/* 1. SE FOR UM PEDIDO NOVO DO CARRINHO (Múltiplos Itens) */}
                      {pedido.detalhes?.itens && pedido.detalhes.itens.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">📦 Itens Solicitados</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {pedido.detalhes.itens.map((item: any, idx: number) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-[#262A2B] leading-tight">{item.produto}</h4>
                                    <span className="font-black text-[#262A2B] whitespace-nowrap">R$ {item.precoItem?.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1 font-semibold">Qtd: {item.quantidade}</p>
                                </div>
                                
                                {item.opcoes && item.opcoes.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Acabamentos Inclusos:</p>
                                    {item.opcoes.map((op: any, i: number) => (
                                      <p key={i} className="flex justify-between text-xs text-gray-600 font-medium">
                                        <span>+ {op.nome}</span>
                                        <span className="text-green-600">+ R$ {op.preco?.toFixed(2).replace('.', ',')}</span>
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. COMPATIBILIDADE COM PEDIDO ANTIGO (Item Único) */}
                      {!pedido.detalhes?.itens && pedido.detalhes?.opcoesEscolhidas && pedido.detalhes.opcoesEscolhidas.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-[#262A2B] uppercase tracking-wider mb-3 flex items-center gap-2">🛠️ Acabamentos Adicionais</p>
                            <ul className="text-sm text-gray-700 space-y-2">
                              {pedido.detalhes.opcoesEscolhidas.map((op: any, i: number) => (
                                <li key={i} className="flex justify-between items-center border-b border-gray-200 pb-1.5 last:border-0 last:pb-0">
                                  <span className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></span> {op.nome || op}</span>
                                  {op.preco && <span className="font-bold text-[#262A2B] text-xs bg-yellow-100 px-2 py-0.5 rounded-md">+ R$ {op.preco.toFixed(2).replace('.', ',')}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* 3. MULTIPLOS BOTÕES DE DOWNLOAD DE PDF (Separando o '|') */}
                      {pedido.arquivoArte && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                          {pedido.arquivoArte.split(' | ').map((url, index) => (
                            <a 
                              key={index}
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 bg-[#262A2B] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-400 hover:text-[#262A2B] transition-all shadow-md"
                            >
                              📄 Baixar Arte {pedido.arquivoArte?.includes('|') ? index + 1 : ''}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Footer: Status e WhatsApp */}
                      <div className="mt-5 flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <select
                          value={pedido.status}
                          onChange={(e) => alterarStatus(pedido.id, e.target.value)}
                          className={`block flex-1 text-xs font-bold py-3 px-4 border-0 rounded-xl cursor-pointer focus:ring-0 ${
                             pedido.status === "ORÇAMENTO" ? "bg-yellow-100 text-yellow-800" :
                             pedido.status === "PRODUÇÃO" ? "bg-blue-100 text-blue-800" :
                             "bg-green-100 text-green-800"
                          }`}
                        >
                          <option value="ORÇAMENTO">ORÇAMENTO</option>
                          <option value="PRODUÇÃO">EM PRODUÇÃO</option>
                          <option value="PRONTO">PRONTO / ENTREGUE</option>
                        </select>

                        <a
                          href={gerarLinkWhatsApp(pedido)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1da851] transition shadow-sm sm:w-auto w-full"
                          title="Avisar cliente no WhatsApp"
                        >
                          <WhatsappLogo size={20} weight="fill" />
                          Avisar no WhatsApp
                        </a>
                      </div>
                    </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}