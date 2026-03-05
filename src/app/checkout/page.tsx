"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ShoppingCart, ArrowLeft, Trash, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // Verifica se o cliente está logado assim que a tela abre
  useEffect(() => {
    const token = localStorage.getItem("token_cliente");
    if (token) {
      setIsLogged(true);
    }
  }, []);

  const finalizarPedido = async () => {
    if (!isLogged) {
      router.push("/login-cliente");
      return;
    }

    setCarregando(true);
    setMensagem({ texto: "", tipo: "" });

    try {
      const token = localStorage.getItem("token_cliente");
      
      // Empacota todos os itens do carrinho de forma legível para o Admin
      const descricaoResumo = cart.length === 1 
        ? `Pedido pelo Site: ${cart[0].produtoNome}` 
        : `Pedido Múltiplo pelo Site (${cart.length} itens)`;

      // Junta todos os links de arte (se houver) separados por vírgula
      const artes = cart.map(item => item.arteUrl).filter(Boolean).join(" | ");

      // Detalha tudo para o banco de dados
      const pacoteFinal = {
        descricao: descricaoResumo,
        valor: cartTotal,
        arquivoArte: artes || undefined,
        detalhes: {
          itens: cart.map(item => ({
            produto: item.produtoNome,
            quantidade: item.quantidadeTexto,
            opcoes: item.opcoesExtras,
            precoItem: item.preco
          }))
        }
      };

      const resposta = await fetch("http://localhost:3333/vitrine/pedidos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(pacoteFinal)
      });

      if (resposta.ok) {
        setMensagem({ texto: "Pedido enviado com sucesso!", tipo: "sucesso" });
        clearCart(); // Esvazia o carrinho!
        
        // Redireciona para os pedidos depois de 2 segundos
        setTimeout(() => {
          router.push("/meus-pedidos");
        }, 2000);
      } else {
        setMensagem({ texto: "Erro ao enviar o pedido. Tente novamente.", tipo: "erro" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  };

  // Se o carrinho estiver vazio (e não estiver no meio do redirecionamento de sucesso)
  if (cart.length === 0 && mensagem.tipo !== "sucesso") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShoppingCart size={80} weight="light" className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-black text-[#262A2B] mb-2">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Parece que você ainda não adicionou nenhum serviço para orçamento.</p>
        <button onClick={() => router.push("/")} className="bg-yellow-400 hover:bg-yellow-500 text-[#262A2B] px-8 py-3 rounded-xl font-bold transition-colors">
          Explorar Serviços
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cabeçalho Simples */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black text-[#262A2B] flex items-center gap-2">
            Finalizar Pedido
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: Resumo dos Itens */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-[#262A2B] ml-2">Revisão do Carrinho ({cart.length} itens)</h2>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            {cart.map((item) => (
              <div key={item.idCart} className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#262A2B]">{item.produtoNome}</h3>
                  <p className="text-sm text-gray-500 mt-1">Quantidade: <span className="font-semibold text-gray-700">{item.quantidadeTexto}</span></p>
                  
                  {item.opcoesExtras && item.opcoesExtras.length > 0 && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Acabamentos Inclusos</p>
                      {item.opcoesExtras.map((opcao, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                          <span>+ {opcao.nome}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.arteUrl && (
                    <span className="inline-block mt-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                      Arte Anexada ✓
                    </span>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                  <span className="text-xl font-black text-[#262A2B]">
                    R$ {item.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <button onClick={() => removeFromCart(item.idCart)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-bold">
                    <Trash size={18} /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: Total e Botão de Ação */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#262A2B] ml-2">Resumo</h2>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
            
            {/* AJUSTE AQUI: flex-wrap e text-2xl/3xl responsivo */}
            <div className="flex flex-wrap justify-between items-center gap-2 mb-6 pb-6 border-b border-gray-100">
              <span className="text-gray-500 font-bold whitespace-nowrap">Total do Pedido</span>
              <span className="text-2xl xl:text-3xl font-black text-[#262A2B]">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {mensagem.texto && (
              <div className={`p-4 mb-6 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {mensagem.tipo === 'sucesso' ? <CheckCircle size={20} weight="fill" /> : <WarningCircle size={20} weight="fill" />}
                {mensagem.texto}
              </div>
            )}

            {!isLogged ? (
              <div className="space-y-3">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-semibold text-center mb-4">
                  Você precisa estar logado para enviar o seu pedido para a gráfica.
                </div>
                <button onClick={() => router.push("/login-cliente")} className="w-full py-4 bg-[#262A2B] hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition-all shadow-md">
                  Fazer Login
                </button>
                <button onClick={() => router.push("/cadastro-cliente")} className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 font-bold text-lg rounded-xl transition-all">
                  Criar uma Conta
                </button>
              </div>
            ) : (
              // AJUSTE AQUI: flex-wrap e controle do ícone
              <button 
                onClick={finalizarPedido} 
                disabled={carregando || mensagem.tipo === "sucesso"}
                className="w-full py-3 sm:py-4 bg-yellow-400 hover:bg-yellow-500 text-[#262A2B] font-black text-base sm:text-lg rounded-xl flex flex-wrap items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed leading-tight text-center"
              >
                {carregando ? "Processando..." : mensagem.tipo === "sucesso" ? "Enviado!" : (
                  <>Enviar para Produção <PaperPlaneTilt size={22} weight="bold" className="shrink-0" /></>
                )}
              </button>
            )}

            <p className="text-xs text-gray-400 text-center mt-6 font-medium">
              Ao enviar, nossa equipe avaliará seu pedido e os arquivos e iniciará a produção.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}