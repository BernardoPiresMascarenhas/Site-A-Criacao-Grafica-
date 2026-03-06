"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CaretDown, CaretUp, Trash, User, MapPin, EnvelopeSimple, Phone } from "@phosphor-icons/react"; // Adicione os ícones do Phosphor

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  // Adicionei os campos de endereço, caso existam no seu banco, para ficarem visíveis nos detalhes
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export default function ClientesPage() {
  const router = useRouter();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [buscaCliente, setBuscaCliente] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  // NOVO ESTADO: Guarda o ID do cliente que está com a "sanfona" aberta
  const [clienteExpandidoId, setClienteExpandidoId] = useState<string | null>(null);

  const buscarClientes = async () => {
    const token = localStorage.getItem("token_cliente");
    if (!token) {
      router.push("/login-cliente");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3333/clientes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setClientes(dados); 
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, [router]);

  const cadastrarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Salvando...");
    const token = localStorage.getItem("token_cliente");

    try {
      const resposta = await fetch("http://localhost:3333/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome, telefone, email })
      });

      if (resposta.ok) {
        setMensagem("Cliente cadastrado com sucesso!");
        setNome("");
        setTelefone("");
        setEmail("");
        buscarClientes();
        setTimeout(() => setMensagem(""), 3000);
      } else {
        setMensagem("Erro ao cadastrar cliente.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  const deletarCliente = async (clienteId: string) => {
    const confirmacao = window.confirm("Tem certeza que deseja apagar este cliente permanentemente?");
    if (!confirmacao) return;

    const token = localStorage.getItem("token_cliente");
    
    try {
      const resposta = await fetch(`http://localhost:3333/clientes/${clienteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resposta.ok) {
        buscarClientes(); 
      } else {
        const erro = await resposta.json();
        alert(erro.error || "Erro ao deletar o cliente. Verifique se há pedidos vinculados.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // Função para abrir e fechar a sanfona de detalhes
  const toggleDetalhes = (id: string) => {
    if (clienteExpandidoId === id) {
      setClienteExpandidoId(null); // Se clicar no que já está aberto, ele fecha
    } else {
      setClienteExpandidoId(id); // Abre o novo e fecha os outros
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = buscaCliente.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      (cliente.email && cliente.email.toLowerCase().includes(termo)) ||
      (cliente.telefone && cliente.telefone.includes(termo))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-[#262A2B]">Gestão de Clientes</h1>
          <button onClick={() => router.push("/painel")} className="text-gray-500 hover:text-yellow-400 underline font-bold">
            Voltar ao Painel
          </button>
        </div>

        {/* Formulário Manual Rápido */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Novo Cliente Manual</h2>
          <form onSubmit={cadastrarCliente} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Nome do Cliente *" value={nome} onChange={(e) => setNome(e.target.value)} required className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
            <input type="text" placeholder="Telefone *" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
            <input type="email" placeholder="E-mail (Opcional)" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
            <button type="submit" className="md:col-span-3 px-6 py-4 bg-[#262A2B] text-white font-bold rounded-xl hover:bg-yellow-400 hover:text-[#262A2B] transition-all shadow-md">Salvar Cliente Rápido</button>
          </form>
          {mensagem && <p className="mt-4 text-center font-bold text-green-600">{mensagem}</p>}
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          
          {/* MÁGICA AQUI: Flexbox para alinhar o título com a Tag de contagem */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Clientes Cadastrados</h2>
            
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-sm border border-yellow-200">
              <User size={20} weight="bold" />
              <span>{clientes.length} {clientes.length === 1 ? 'Cliente Total' : 'Clientes Totais'}</span>
            </div>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center">
            <div className="flex-1 w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Pesquisar cliente por nome, e-mail ou telefone..." 
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-[#262A2B] font-medium"
              />
            </div>
          </div>
          
          {clientesFiltrados.length === 0 ? (
            <p className="text-gray-500 font-bold text-center py-8">Nenhum cliente encontrado.</p>
          ) : (
            <div className="space-y-4">
              {clientesFiltrados.map((cliente) => {
                const isExpandido = clienteExpandidoId === cliente.id; // Verifica se este é o que deve estar aberto

                return (
                  <div key={cliente.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:border-yellow-300">
                    
                    {/* PARTE SEMPRE VISÍVEL (Cabeçalho do Card) */}
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                          <User size={20} weight="fill" />
                        </div>
                        <div>
                          <p className="font-black text-lg text-[#262A2B] leading-tight">{cliente.nome}</p>
                          <button 
                            onClick={() => toggleDetalhes(cliente.id)}
                            className="text-xs font-bold text-gray-400 hover:text-yellow-600 flex items-center gap-1 mt-1 transition-colors focus:outline-none"
                          >
                            {isExpandido ? "Ocultar Detalhes" : "Ver Mais Detalhes"}
                            {isExpandido ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <p className="font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-md text-sm border border-gray-100">
                          {cliente.telefone}
                        </p>
                        <button 
                          onClick={() => deletarCliente(cliente.id)}
                          className="text-gray-300 hover:text-red-500 hover:bg-red-50 transition p-2 rounded-lg"
                          title="Deletar cliente"
                        >
                          <Trash size={20} weight="fill" />
                        </button>
                      </div>
                    </div>

                    {/* ÁREA EXPANSÍVEL (Só aparece se isExpandido for true) */}
                    {isExpandido && (
                      <div className="bg-gray-50 p-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Contato Principal */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Informações de Contato</h4>
                          
                          <div className="flex items-center gap-2 text-sm text-[#262A2B]">
                            <Phone size={16} className="text-yellow-500" />
                            <span className="font-bold">{cliente.telefone}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-[#262A2B]">
                            <EnvelopeSimple size={16} className="text-yellow-500" />
                            <span className="font-bold">{cliente.email || "E-mail não informado"}</span>
                          </div>
                        </div>

                        {/* Endereço (Se houver) */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Endereço</h4>
                          
                          {cliente.logradouro ? (
                            <div className="flex items-start gap-2 text-sm text-[#262A2B]">
                              <MapPin size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                              <div className="font-medium">
                                <p>{cliente.logradouro}, {cliente.numero} {cliente.complemento && `- ${cliente.complemento}`}</p>
                                <p>{cliente.bairro} - {cliente.cidade}/{cliente.estado}</p>
                                <p className="text-gray-500 text-xs mt-0.5">CEP: {cliente.cep}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">Endereço não cadastrado.</p>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}