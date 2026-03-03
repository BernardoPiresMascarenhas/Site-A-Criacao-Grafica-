"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Moldes do TypeScript
interface Cliente {
  id: string;
  nome: string;
}

interface Pedido {
  id: string;
  descricao: string;
  valor: number;
  status: string;
  cliente: Cliente; // Olha o relacionamento aparecendo aqui no Frontend!
}

export default function PedidosPage() {
  const router = useRouter();
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); // Para a lista do <select>
  
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
      // Buscamos os pedidos
      const resPedidos = await fetch("http://localhost:3333/pedidos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Buscamos os clientes para o formulário
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
          valor: parseFloat(valor), // Converte o texto para número decimal
          clienteId 
        })
      });

      if (resposta.ok) {
        setMensagem("Orçamento criado com sucesso!");
        setDescricao("");
        setValor("");
        setClienteId("");
        carregarDados(); // Atualiza a lista na tela
        setTimeout(() => setMensagem(""), 3000);
      } else {
        setMensagem("Erro ao criar o orçamento.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    }
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

            {/* A mágica da seleção do cliente! */}
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
                <div key={pedido.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <p className="font-bold text-gray-800">{pedido.descricao}</p>
                    {/* Exibindo o nome do cliente através do relacionamento */}
                    <p className="text-sm text-gray-500">Cliente: {pedido.cliente.nome}</p> 
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {pedido.valor.toFixed(2).replace('.', ',')}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                      {pedido.status}
                    </span>
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