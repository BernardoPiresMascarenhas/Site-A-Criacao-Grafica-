"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definimos o "molde" de como é um Cliente para o TypeScript não reclamar
interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
}

export default function ClientesPage() {
  const router = useRouter();
  
  // Nossos "cofres" de dados (estados)
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Função que vai no backend buscar a lista de clientes
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
        setClientes(dados); // Guarda a lista recebida no estado
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  // Carrega a lista de clientes assim que a página abre
  useEffect(() => {
    buscarClientes();
  }, [router]);

  // Função ativada quando o formulário é enviado
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
        // Limpa os campos do formulário
        setNome("");
        setTelefone("");
        setEmail("");
        // Atualiza a lista na tela
        buscarClientes();
        
        // Apaga a mensagem verde depois de 3 segundos
        setTimeout(() => setMensagem(""), 3000);
      } else {
        setMensagem("Erro ao cadastrar cliente.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Gestão de Clientes</h1>
          <button 
            onClick={() => router.push("/painel")}
            className="text-gray-500 hover:text-blue-500 underline"
          >
            Voltar ao Painel
          </button>
        </div>

        {/* Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Novo Cliente</h2>
          
          <form onSubmit={cadastrarCliente} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome do Cliente *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Telefone *"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="E-mail (Opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="md:col-span-3 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Salvar Cliente
            </button>
          </form>
          {mensagem && <p className="mt-4 text-center text-green-600 font-medium">{mensagem}</p>}
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Clientes Cadastrados</h2>
          
          {clientes.length === 0 ? (
            <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <p className="font-bold text-gray-800">{cliente.nome}</p>
                    <p className="text-sm text-gray-500">{cliente.email || "Sem e-mail"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-700">{cliente.telefone}</p>
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