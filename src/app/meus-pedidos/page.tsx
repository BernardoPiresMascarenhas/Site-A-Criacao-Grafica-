"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Clock, Printer, CheckCircle } from "@phosphor-icons/react";

interface Pedido {
  id: string;
  descricao: string;
  valor: number;
  status: string;
}

export default function MeusPedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroBackend, setErroBackend] = useState(""); // Novo estado para exibir erros

  useEffect(() => {
    const carregarPedidos = async () => {
      const token = localStorage.getItem("token_cliente");
      
      if (!token) {
        router.push("/login-cliente");
        return;
      }

      try {
        const resposta = await fetch("http://localhost:3333/meus-pedidos", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resposta.ok) {
          setPedidos(await resposta.json());
        } else {
          // AGORA ELE SÓ EXPULSA SE FOR ERRO 401 (Token realmente inválido)
          if (resposta.status === 401) {
            localStorage.removeItem("token_cliente");
            localStorage.removeItem("dados_cliente");
            localStorage.removeItem("nome_cliente");
            router.push("/login-cliente");
          } else {
            // Se for outro erro (ex: 404, 500), ele apenas avisa na tela e não te desloga!
            setErroBackend(`O servidor retornou um erro (Código ${resposta.status}). A rota pode estar ausente.`);
          }
        }
      } catch (error) {
        setErroBackend("Erro de conexão com o servidor. O backend está rodando?");
      } finally {
        setCarregando(false);
      }
    };

    carregarPedidos();
  }, [router]);

  const renderStatus = (status: string) => {
    switch (status) {
      case "ORÇAMENTO":
        return (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full font-bold text-sm">
            <Clock size={18} weight="bold" /> Aguarda Aprovação
          </div>
        );
      case "PRODUÇÃO":
        return (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold text-sm">
            <Printer size={18} weight="bold" /> Em Produção
          </div>
        );
      case "PRONTO":
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold text-sm">
            <CheckCircle size={18} weight="bold" /> Pronto / Entregue
          </div>
        );
      default:
        return <span className="text-gray-500 font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-16">
      
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
            title="Voltar ao Início"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black text-[#262A2B] flex items-center gap-2">
            <Package size={28} className="text-yellow-500" weight="duotone" />
            Minhas Encomendas
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8">
        {carregando ? (
          <div className="text-center text-gray-400 py-10 font-bold text-lg animate-pulse">
            A carregar histórico...
          </div>
        ) : erroBackend ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center font-bold">
            {erroBackend}
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 mt-8">
            <Package size={64} className="mx-auto text-gray-300 mb-4" weight="light" />
            <h2 className="text-xl font-bold text-gray-700">Ainda não tens encomendas.</h2>
            <p className="text-gray-500 mt-2">Visita a nossa vitrine e solicita o teu primeiro orçamento!</p>
            <button 
              onClick={() => router.push("/")}
              className="mt-6 bg-[#262A2B] text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition"
            >
              Ver Serviços
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{pedido.descricao}</h3>
                  <p className="text-gray-500 text-sm mt-1">ID do Pedido: <span className="font-mono text-xs">{pedido.id.split('-')[0]}...</span></p>
                </div>
                
                <div className="flex flex-col sm:items-end gap-3">
                  <span className="text-xl font-black text-[#262A2B]">
                    R$ {pedido.valor.toFixed(2).replace('.', ',')}
                  </span>
                  {renderStatus(pedido.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}