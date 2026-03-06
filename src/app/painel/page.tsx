"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend // <-- Adicionei aqui
} from 'recharts';

// Molde para o TypeScript saber o que vem do backend
interface Metricas {
  totalClientes: number;
  emProducao: number;
  orcamentos: number;
  faturamentoTotal: number;
}

export default function PainelPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  
  // Estado para guardar os números do Dashboard
  const [metricas, setMetricas] = useState<Metricas>({
    totalClientes: 0,
    emProducao: 0,
    orcamentos: 0,
    faturamentoTotal: 0
  });

  // Controle de qual gráfico mostrar
  const [graficoAtivo, setGraficoAtivo] = useState<'faturamento' | 'status' | 'produtos'>('faturamento');


  const [dadosFaturamento, setDadosFaturamento] = useState<any[]>([]);
  const [dadosStatus, setDadosStatus] = useState<any[]>([]);
  const [dadosProdutos, setDadosProdutos] = useState<any[]>([]);
  const [carregandoGraficos, setCarregandoGraficos] = useState(true);

  const coresStatus = ['#facc15', '#3b82f6', '#22c55e'];


  useEffect(() => {
    const carregarGraficos = async () => {
      try {
        const resposta = await fetch("http://localhost:3333/dashboard/graficos");
        if (resposta.ok) {
          const dadosReais = await resposta.json();
          setDadosFaturamento(dadosReais.dadosFaturamento);
          setDadosStatus(dadosReais.dadosStatus);
          setDadosProdutos(dadosReais.dadosProdutos);
        }
      } catch (error) {
        console.error("Erro ao buscar dados dos gráficos:", error);
      } finally {
        setCarregandoGraficos(false);
      }
    };

    carregarGraficos();
  }, []);
  
  useEffect(() => {
    const carregarPainel = async () => {
      // 1. ATUALIZADO: Procurando a chave nova!
      const token = localStorage.getItem("token_cliente");

      if (!token) {
        // 2. ATUALIZADO: Mandando para a tela de login correta
        router.push("/login-cliente");
        return;
      }

      try {
        const resPerfil = await fetch("http://localhost:3333/perfil", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const resMetricas = await fetch("http://localhost:3333/metricas", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (resPerfil.ok && resMetricas.ok) {
          const dadosPerfil = await resPerfil.json();
          const dadosMetricas = await resMetricas.json();
          
          setNomeUsuario(dadosPerfil.nome); 
          setMetricas(dadosMetricas); 
          setAutorizado(true);
        } else {
          // 3. ATUALIZADO: Limpando a chave certa e mandando pro lugar certo
          localStorage.removeItem("token_cliente");
          router.push("/login-cliente");
        }
      } catch (error) {
        console.error("Erro ao carregar painel:", error);
      }
    };

    carregarPainel();
  }, [router]);

  // 4. ATUALIZADO: Limpando tudo do sistema novo na hora de sair
  const fazerLogout = () => {
    localStorage.removeItem("token_cliente");
    localStorage.removeItem("nome_cliente");
    localStorage.removeItem("dados_cliente");
    router.push("/login-cliente");
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl font-bold text-gray-500 animate-pulse">A carregar dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
      
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#262A2B]">A Criação Gráfica</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bem-vindo(a), <span className="font-bold text-yellow-600">{nomeUsuario}</span>
          </p>
        </div>
        <button 
          onClick={fazerLogout} 
          className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Sair do Sistema
        </button>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-8 space-y-8">
        
        {/* SEÇÃO 1: Os Cartões de Métricas (Dashboard) */}
        <section>
          <h2 className="text-xl font-black mb-4 text-[#262A2B]">Visão Geral da Gráfica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Cartão Faturamento */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:border-yellow-400 hover:shadow-md transition-all duration-300">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Faturamento (Entregues)</span>
              <span className="text-3xl font-bold text-green-600 mt-2">
                R$ {metricas.faturamentoTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Cartão Produção */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:border-yellow-400 hover:shadow-md transition-all duration-300">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pedidos em Produção</span>
              <span className="text-3xl font-black text-[#262A2B] mt-2">{metricas.emProducao}</span>
            </div>

            {/* Cartão Orçamentos (Deixei o número em amarelo para destacar o que precisa de atenção!) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:border-yellow-400 hover:shadow-md transition-all duration-300 border-l-4 border-l-yellow-400">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Aguardando Aprovação</span>
              <span className="text-3xl font-black text-yellow-600 mt-2">{metricas.orcamentos}</span>
            </div>

            {/* Cartão Clientes */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:border-yellow-400 hover:shadow-md transition-all duration-300">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Clientes Cadastrados</span>
              <span className="text-3xl font-black text-[#262A2B] mt-2">{metricas.totalClientes}</span>
            </div>

          </div>
        </section>

              
        {/* SEÇÃO 2: Menu de Acesso Rápido */}
        <section>
          <h2 className="text-xl font-black mb-4 text-[#262A2B]">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Botão Clientes */}
            <button 
              onClick={() => router.push('/painel/clientes')}
              className="flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-300 text-left group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">👥</span>
              <div>
                <span className="block text-lg font-black text-[#262A2B] group-hover:text-yellow-600 transition-colors">Clientes</span>
                <span className="text-sm text-gray-500 font-medium">Gerenciar carteira de clientes</span>
              </div>
            </button>

            {/* Botão Orçamentos */}
            <button 
              onClick={() => router.push('/painel/pedidos')}
              className="flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-300 text-left group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">🖨️</span>
              <div>
                <span className="block text-lg font-black text-[#262A2B] group-hover:text-yellow-600 transition-colors">Orçamentos</span>
                <span className="text-sm text-gray-500 font-medium">Criar pedidos e gerenciar fila</span>
              </div>
            </button>

            {/* Botão Catálogo */}
            <button 
              onClick={() => router.push('/painel/catalogo')}
              className="flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-300 text-left group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">🏷️</span>
              <div>
                <span className="block text-lg font-black text-[#262A2B] group-hover:text-yellow-600 transition-colors">Catálogo</span>
                <span className="text-sm text-gray-500 font-medium">Cadastrar produtos da vitrine</span>
              </div>
            </button>

          </div>
        </section>

        {/* SEÇÃO 3: Análise e Inteligência de Negócio (BI) */}
        <section className="mt-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            
            {/* Cabeçalho do Gráfico e Botões de Controle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-xl font-black text-[#262A2B]">Desempenho da Gráfica</h2>
              
              {/* Seletor de Gráficos */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setGraficoAtivo('faturamento')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${graficoAtivo === 'faturamento' ? 'bg-[#262A2B] text-white shadow' : 'text-gray-500 hover:text-[#262A2B]'}`}
                >
                  Faturamento
                </button>
                <button 
                  onClick={() => setGraficoAtivo('status')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${graficoAtivo === 'status' ? 'bg-[#262A2B] text-white shadow' : 'text-gray-500 hover:text-[#262A2B]'}`}
                >
                  Status
                </button>
                <button 
                  onClick={() => setGraficoAtivo('produtos')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${graficoAtivo === 'produtos' ? 'bg-[#262A2B] text-white shadow' : 'text-gray-500 hover:text-[#262A2B]'}`}
                >
                  Mais Vendidos
                </button>
              </div>
            </div>

            {/* Área do Gráfico */}
            <div className="h-80 w-full flex items-center justify-center">
              {carregandoGraficos ? (
                 <p className="text-gray-400 font-bold animate-pulse">Carregando inteligência de negócios...</p>
              ) : (
                 <>
                   {graficoAtivo === 'faturamento' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosFaturamento} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="dia" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(value) => `R$${value}`} tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toFixed(2).replace('.', ',')}`, 'Faturamento']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="valor" stroke="#facc15" strokeWidth={4} dot={{ r: 6, fill: '#262A2B', strokeWidth: 2, stroke: '#facc15' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {/* 2. Gráfico de Status (Rosca) */}
              {graficoAtivo === 'status' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    <Pie 
                      data={dadosStatus} 
                      innerRadius={80} 
                      outerRadius={120} 
                      paddingAngle={5} 
                      dataKey="quantidade"
                      nameKey="nome" 
                    >
                      {dadosStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={coresStatus[index % coresStatus.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* 3. Gráfico de Produtos (Barras) */}
              {graficoAtivo === 'produtos' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosProdutos} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="nome" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="vendas" fill="#262A2B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
                 </>
              )}
            </div>            
          </div>
        </section>

      </main>
    </div>
  );
}
          