"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WhatsappLogo } from "@phosphor-icons/react";

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
  criadoEm?: string; // <--- ADICIONE ESTA LINHA (ou createdAt se for assim no seu schema.prisma)
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
  
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarDados = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
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
    const token = localStorage.getItem("token");

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
    const token = localStorage.getItem("token");
    
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

  // A NOVA FUNÇÃO DE DELETAR VEM AQUI!
  const deletarPedido = async (pedidoId: string) => {
    // A trava de segurança para evitar acidentes:
    const confirmacao = window.confirm("Tem certeza que deseja apagar este orçamento permanentemente?");
    if (!confirmacao) return; // Se a pessoa clicar em "Cancelar", a função para aqui.

    const token = localStorage.getItem("token");
    
    try {
      const resposta = await fetch(`http://localhost:3333/pedidos/${pedidoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resposta.ok) {
        carregarDados(); // Recarrega a lista e o orçamento some da tela!
      } else {
        alert("Erro ao deletar o pedido.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // FUNÇÃO MÁGICA DO WHATSAPP
  const gerarLinkWhatsApp = (pedido: any) => {
    // Pega o telefone do cliente (se você tiver o campo no banco) ou deixa em branco para o admin digitar na hora
    const telefone = pedido.cliente?.telefone || ""; 
    const numeroLimpo = telefone.replace(/\D/g, ''); // Tira traços e parênteses
    
    // Pega só o primeiro nome do cliente para ficar amigável
    const nomeCliente = pedido.cliente?.nome ? pedido.cliente.nome.split(' ')[0] : "Cliente";

    let mensagem = "";

    // Mensagens dinâmicas baseadas no status da gráfica!
    if (pedido.status === "ORÇAMENTO") {
      mensagem = `Olá, ${nomeCliente}! Recebemos o seu pedido de orçamento para "${pedido.descricao}". Em breve entraremos em contato com os detalhes e valores finais!`;
    } else if (pedido.status === "PRODUÇÃO") {
      mensagem = `Olá, ${nomeCliente}! Boas notícias: o seu pedido "${pedido.descricao}" acabou de entrar em produção na A Criação Gráfica! 🖨️🚀`;
    } else if (pedido.status === "PRONTO") {
      mensagem = `Olá, ${nomeCliente}! O seu pedido "${pedido.descricao}" está PRONTO para retirada! 🎉 Já pode vir buscar na nossa gráfica.`;
    }

    return `https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Pedidos & Orçamentos</h1>
          <button onClick={() => router.push("/painel")} className="text-gray-500 hover:text-blue-500 underline">
            Voltar ao Painel
          </button>
        </div>

        {/* Formulário */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Novo Orçamento</h2>
          
          <form onSubmit={cadastrarPedido} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Descrição do serviço (Ex: 1000 Cartões)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
            />
            
            <input
              type="number"
              step="0.01"
              placeholder="Valor (R$)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
            />

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              required
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Selecione um Cliente...</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>

            <button type="submit" className="md:col-span-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              Criar Orçamento
            </button>
          </form>
          {mensagem && <p className="mt-4 text-center text-green-600 font-medium">{mensagem}</p>}
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Histórico de Pedidos</h2>
          
          {pedidos.length === 0 ? (
            <p className="text-gray-500">Nenhum pedido registrado ainda.</p>
          ) : (
            <div className="space-y-3">
               {pedidos.map((pedido) => (
                  <div key={pedido.id} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:border-gray-200 transition">
                     
                     {/* Cabeçalho do Card: Descrição e Dados do Cliente */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                      <div>
                        {/* TÍTULO E DATA/HORA */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <p className="font-black text-lg text-gray-800 leading-none">{pedido.descricao}</p>
                          {pedido.criadoEm && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold border border-gray-200" title="Data e hora do pedido">
                              📅 {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')} às {new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        
                        {/* Box de Contato do Cliente (mantenha o seu código aqui para baixo...) */}
                        <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600 space-y-1">
                          <p><span className="font-bold text-gray-700">👤 Cliente:</span> {pedido.cliente?.nome}</p>
                          {pedido.cliente?.telefone && (
                             <p><span className="font-bold text-gray-700">📱 WhatsApp:</span> {pedido.cliente.telefone}</p>
                          )}
                          {pedido.cliente?.email && (
                             <p><span className="font-bold text-gray-700">✉️ E-mail:</span> {pedido.cliente.email}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Preço Total e Lixeira */}
                      <div className="flex items-center gap-4 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Valor Total</p>
                          <p className="font-black text-green-700 text-lg">R$ {pedido.valor.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="h-8 w-px bg-green-200 mx-1"></div>
                        <button 
                           onClick={() => deletarPedido(pedido.id)}
                           className="text-red-400 hover:text-red-600 transition bg-white p-2 rounded-md shadow-sm"
                           title="Deletar orçamento"
                        >
                           🗑️
                        </button>
                      </div>
                    </div>

                    {/* AQUI ENTRA A MÁGICA: Detalhes com Preço e PDF */}
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-3 pt-4 border-t border-gray-100">
                      
                      {/* Opções escolhidas via JSON */}
                      {pedido.detalhes?.opcoesEscolhidas && pedido.detalhes.opcoesEscolhidas.length > 0 && (
                        <div className="flex-1 w-full bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                             🛠️ Acabamentos Adicionais
                          </p>
                          <ul className="text-sm text-slate-700 space-y-1.5">
                            {pedido.detalhes.opcoesEscolhidas.map((op: any, i: number) => {
                              // Verifica se é o pedido antigo (só texto) ou o novo (com preço)
                              if (typeof op === 'string') {
                                return <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> {op}</li>;
                              }
                              // Formato novo rico em detalhes!
                              return (
                                <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> {op.nome}</span>
                                  <span className="font-bold text-green-600 text-xs">+ R$ {op.preco.toFixed(2).replace('.', ',')}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Link para Download do PDF */}
                      {pedido.arquivoArte && (
                        <a 
                          href={pedido.arquivoArte} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-100 transition border border-blue-200 w-full md:w-auto flex-shrink-0"
                        >
                          📄 Baixar Arte Enviada
                        </a>
                      )}
                    </div>

                    {/* Status e Botão WhatsApp */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      
                      <select
                        value={pedido.status}
                        onChange={(e) => alterarStatus(pedido.id, e.target.value)}
                        className={`block flex-1 text-xs font-bold py-2 px-3 border-0 rounded-md cursor-pointer focus:ring-0 ${
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
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-[#1da851] transition shadow-sm sm:w-auto w-full"
                        title="Avisar cliente no WhatsApp"
                      >
                        <WhatsappLogo size={18} weight="fill" />
                        Avisar Cliente
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