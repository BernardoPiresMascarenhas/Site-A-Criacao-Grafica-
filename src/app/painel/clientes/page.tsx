"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
}

export default function ClientesPage() {
  const router = useRouter();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Estado para a barra de pesquisa
  const [buscaCliente, setBuscaCliente] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const buscarClientes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
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
    const token = localStorage.getItem("token");

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

  // NOVA FUNÇÃO DE DELETAR CLIENTE AQUI:
  const deletarCliente = async (clienteId: string) => {
    const confirmacao = window.confirm("Tem certeza que deseja apagar este cliente permanentemente?");
    if (!confirmacao) return;

    const token = localStorage.getItem("token");
    
    try {
      const resposta = await fetch(`http://localhost:3333/clientes/${clienteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resposta.ok) {
        buscarClientes(); // Atualiza a lista e o cliente some
      } else {
        // Se a resposta não for OK, pegamos o erro que mandamos do backend
        const erro = await resposta.json();
        alert(erro.error || "Erro ao deletar o cliente. Verifique se há pedidos vinculados.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // Filtra os clientes pelo nome, email ou telefone
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
          <button onClick={() => router.push("/painel")} className="text-gray-500 hover:text-yellow-400 underline">
            Voltar ao Painel
          </button>
        </div>

        {/* Formulário */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Novo Cliente</h2>
          <form onSubmit={cadastrarCliente} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Nome do Cliente *" value={nome} onChange={(e) => setNome(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500" />
            <input type="text" placeholder="Telefone *" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500" />
            <input type="email" placeholder="E-mail (Opcional)" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500" />
            <button type="submit" className="md:col-span-3 px-6 py-3 bg-[#262A2B] text-white font-bold rounded-xl hover:bg-yellow-400 hover:text-[#262A2B] transition-all shadow-md">Salvar Cliente</button>
          </form>
          {mensagem && <p className="mt-4 text-center text-green-600 font-medium">{mensagem}</p>}
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Clientes Cadastrados</h2>

          {/* BARRA DE PESQUISA DE CLIENTES */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center">
            <div className="flex-1 w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Pesquisar cliente por nome, e-mail ou telefone..." 
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-[#262A2B]"
              />
            </div>
          </div>
          
          {clientesFiltrados.length === 0 ? (
            <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {clientesFiltrados.map((cliente) => (
                <div key={cliente.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <p className="font-bold text-gray-800">{cliente.nome}</p>
                    <p className="text-sm text-gray-500">{cliente.email || "Sem e-mail"}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <p className="font-medium text-gray-700">{cliente.telefone}</p>
                    
                    {/* BOTÃO DE LIXEIRA */}
                    <button 
                      onClick={() => deletarCliente(cliente.id)}
                      className="text-red-400 hover:text-red-600 transition p-2"
                      title="Deletar cliente"
                    >
                      🗑️
                    </button>
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