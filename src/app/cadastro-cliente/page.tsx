"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, EnvelopeSimple, Phone, LockKey, MapPin, House, Hash, ArrowLeft } from "@phosphor-icons/react";

export default function CadastroClientePage() {
  const router = useRouter();

  // Estados dos Dados Pessoais
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estados do Endereço
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // ==========================================
  // BUSCA DE CEP AUTOMÁTICA (Mágica acontecendo)
  // ==========================================
  const buscarCep = async (cepBuscado: string) => {
    // Limpa a formatação (deixa só os números)
    const cepLimpo = cepBuscado.replace(/\D/g, '');
    setCep(cepBuscado); // Atualiza o input

    if (cepLimpo.length === 8) {
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (!dados.erro) {
          setLogradouro(dados.logradouro);
          setBairro(dados.bairro);
          setCidade(dados.localidade);
          setEstado(dados.uf);
          // O foco vai automaticamente para o campo "Número" na vida real, mas aqui já preenchemos!
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      }
    }
  };

  // ==========================================
  // FUNÇÃO DE SALVAR O CLIENTE NO BACKEND
  // ==========================================
  const fazerCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // Ajuste a URL abaixo se a sua rota de cadastro no server.ts tiver outro nome
      const resposta = await fetch("http://localhost:3333/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, telefone, email, senha,
          cep, logradouro, numero, complemento, bairro, cidade, estado
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Redireciona para o login após criar a conta com sucesso!
        router.push("/login-cliente");
      } else {
        setErro(dados.error || "Erro ao criar conta. Verifique os dados.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Cabeçalho */}
        <div className="bg-[#262A2B] p-8 text-center relative">
          <button 
            onClick={() => router.push('/login-cliente')}
            className="absolute left-6 top-8 text-gray-400 hover:text-white transition-colors"
            title="Voltar para o Login"
          >
            <ArrowLeft size={24} weight="bold" />
          </button>
          <h1 className="text-2xl font-black text-white mt-2">Criar sua Conta</h1>
          <p className="text-gray-400 text-sm mt-2">Preencha seus dados para fazer pedidos na gráfica.</p>
        </div>

        <form onSubmit={fazerCadastro} className="p-8 space-y-8">
          
          {/* SESSÃO 1: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#262A2B] border-b pb-2">Dados Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={20} /></div>
                <input type="text" placeholder="Seu Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone size={20} /></div>
                <input type="text" placeholder="Telefone / WhatsApp" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><EnvelopeSimple size={20} /></div>
                <input type="email" placeholder="Seu E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><LockKey size={20} /></div>
                <input type="password" placeholder="Crie uma Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          {/* SESSÃO 2: ENDEREÇO DE ENTREGA */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#262A2B] border-b pb-2">Endereço de Entrega</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><MapPin size={20} /></div>
                <input type="text" placeholder="CEP" value={cep} onChange={(e) => buscarCep(e.target.value)} maxLength={9} className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all font-bold" />
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><House size={20} /></div>
                <input type="text" placeholder="Rua / Avenida" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Hash size={20} /></div>
                <input type="text" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full pl-10 pr-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>

              <div className="relative md:col-span-3">
                <input type="text" placeholder="Complemento (Apto, Bloco... opcional)" value={complemento} onChange={(e) => setComplemento(e.target.value)} className="w-full px-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full px-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div className="relative">
                <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full px-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div className="relative">
                <input type="text" placeholder="UF (Ex: MG)" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} className="w-full px-4 py-3 text-slate-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 focus:bg-white transition-all uppercase" />
              </div>
            </div>
          </div>

          {erro && <p className="text-red-500 text-sm font-semibold text-center">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-yellow-400 text-[#262A2B] py-4 rounded-xl font-black text-lg hover:bg-yellow-500 transition-all shadow-md disabled:opacity-70 mt-4"
          >
            {carregando ? "Criando Conta..." : "Finalizar Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}